#!/usr/bin/env python3
"""Exercise the fictional local demo in Chromium; never connect a real source."""
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = Path(os.environ.get("QWEN_BROWSER_ARTIFACT_DIR") or tempfile.mkdtemp(prefix="qwen-browser-"))
CHECKS = []


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def passed(name):
    CHECKS.append({"name": name, "passed": True})


def fresh_page(browser, url, width=1366, height=768, init_script=None):
    context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
    if init_script:
        context.add_init_script(init_script)
    page = context.new_page()
    errors, external = [], []
    page.on("pageerror", lambda error: errors.append(str(error)))
    origin = url.rsplit("/demo/", 1)[0] + "/"

    def local_only(route):
        if route.request.url.startswith(origin):
            route.continue_()
        else:
            external.append(route.request.url)
            route.abort()

    context.route("**/*", local_only)
    page.goto(url, wait_until="networkidle")
    expect(page.locator("#workspace article")).to_have_count(12)
    return context, page, errors, external


def assert_clean(errors, external):
    assert not errors, errors
    assert not external, external


def check_layouts(browser, url):
    for label, width, height in [("desktop", 1366, 768), ("tablet", 768, 1024), ("mobile", 390, 844)]:
        context, page, errors, external = fresh_page(browser, url, width, height)
        try:
            for mode in ["equal", "mosaic", "grouped", "featured", "split"]:
                page.select_option("#mode", mode)
                expect(page.locator("#workspace article")).to_have_count(2 if mode == "split" else 12)
                bounds = page.evaluate("""() => ({
                    viewport: innerWidth,
                    width: document.documentElement.scrollWidth,
                    cards: [...document.querySelectorAll('#workspace article')].map(element => {
                        const box = element.getBoundingClientRect();
                        return {left: box.left, right: box.right, width: box.width};
                    })
                })""")
                assert bounds["width"] <= bounds["viewport"] + 1, (label, mode, bounds)
                assert all(card["left"] >= -1 and card["right"] <= width + 1 and card["width"] > 150
                           for card in bounds["cards"]), (label, mode, bounds)
                passed(label + " " + mode + " layout")
                if mode == "mosaic":
                    page.screenshot(path=str(ARTIFACTS / (label + "-mosaic.png")), full_page=True)
            assert_clean(errors, external)
        finally:
            context.close()


def check_history_and_controls(browser, url):
    context, page, errors, external = fresh_page(browser, url)
    try:
        page.select_option("#mode", "mosaic")
        page.click("#undo")
        expect(page.locator("#mode")).to_have_value("equal")
        page.click("#redo")
        expect(page.locator("#mode")).to_have_value("mosaic")
        passed("first edit undo and redo")

        page.click("#reset")
        page.select_option("#mode", "grouped")
        page.click("#undo")
        expect(page.locator("#mode")).to_have_value("equal")
        passed("first edit after reset can undo")

        page.select_option("#mode", "mosaic")
        page.select_option("#viewer", "designer-two")
        expect(page.locator("#mode")).to_have_value("equal")
        expect(page.locator("#workspace article")).to_have_count(11)
        expect(page.locator('[data-module-id="notes"]')).to_have_count(0)
        page.select_option("#mode", "split")
        page.click("#undo")
        expect(page.locator("#mode")).to_have_value("equal")
        page.select_option("#viewer", "designer-one")
        expect(page.locator("#mode")).to_have_value("mosaic")
        expect(page.locator('[data-module-id="notes"]')).to_have_count(1)
        passed("independent simulated viewer history and projection")

        page.locator("#module-groceries-later").focus()
        page.keyboard.press("Enter")
        expect(page.locator("#workspace article").nth(1)).to_have_attribute("data-module-id", "groceries")
        expect(page.locator("#module-groceries-later")).to_be_focused()
        page.click("#module-groceries-size")
        expect(page.locator('[data-module-id="groceries"]')).to_have_class(re.compile(r"span-2"))
        expect(page.locator("#module-groceries-size")).to_be_focused()
        passed("reorder and resize preserve keyboard focus")

        page.click("#module-groceries-hide")
        expect(page.locator('[data-module-id="groceries"]')).to_have_count(0)
        expect(page.locator("#showHidden")).to_be_focused()
        page.click("#showHidden")
        expect(page.locator("#workspace article")).to_have_count(12)
        for _ in range(12):
            page.locator('#workspace button[aria-label^="Hide "]').first.click()
        expect(page.locator("#workspace .empty")).to_be_visible()
        page.click("#showHidden")
        expect(page.locator("#workspace article")).to_have_count(12)
        passed("hide, empty state and restore")

        page.locator("#module-groceries-open").focus()
        page.keyboard.press("Enter")
        expect(page.locator("#focus-back")).to_be_focused()
        page.keyboard.press("Escape")
        expect(page.locator("#module-groceries-open")).to_be_focused()
        page.click("#attention-groceries")
        expect(page.locator("#focus-back")).to_be_focused()
        page.keyboard.press("Enter")
        expect(page.locator("#attention-groceries")).to_be_focused()
        passed("focus view returns to the actual opener")

        page.select_option("#mode", "featured")
        page.reload(wait_until="networkidle")
        expect(page.locator("#mode")).to_have_value("featured")
        page.click("#undo")
        expect(page.locator("#mode")).to_have_value("mosaic")
        passed("demo history survives reload and remains undoable")
        assert_clean(errors, external)
    finally:
        context.close()


def check_presentation(browser, url):
    context, page, errors, external = fresh_page(browser, url)
    try:
        page.on("dialog", lambda dialog: dialog.accept())
        page.click("#present")
        expect(page.locator("#workspace")).to_have_attribute("role", "dialog")
        expect(page.locator("#workspace")).to_have_attribute("aria-modal", "true")
        expect(page.locator("#presentation-exit")).to_be_focused()
        expect(page.locator('[data-module-id="budget"]')).to_have_count(0)
        assert page.locator(".toolbar").evaluate("element => element.inert")
        page.keyboard.press("Tab")
        expect(page.locator("#presentation-exit")).to_be_focused()
        page.keyboard.press("Shift+Tab")
        expect(page.locator("#presentation-exit")).to_be_focused()
        page.screenshot(path=str(ARTIFACTS / "mock-presentation.png"))
        if page.evaluate("Boolean(document.fullscreenElement)"):
            page.evaluate("document.exitFullscreen()")
            expect(page.locator("#workspace")).to_have_attribute("role", "region")
            expect(page.locator("#present")).to_be_focused()
            passed("native fullscreen exit returns to dashboard")
        else:
            page.click("#presentation-exit")
            passed("mock presentation button exit without native fullscreen")
        page.click("#present")
        page.keyboard.press("Escape")
        expect(page.locator("#workspace")).to_have_attribute("role", "region")
        expect(page.locator("#present")).to_be_focused()
        assert not page.locator(".toolbar").evaluate("element => element.inert")
        passed("presentation keyboard containment and Escape return")
        assert_clean(errors, external)
    finally:
        context.close()


def check_optional_storage(browser, url):
    cases = {
        "getter": "Object.defineProperty(window, 'localStorage', {get(){throw new DOMException('Synthetic storage blocked', 'SecurityError')}})",
        "read": "Storage.prototype.getItem = function(){throw new DOMException('Synthetic read blocked', 'SecurityError')}",
        "write": "Storage.prototype.setItem = function(){throw new DOMException('Synthetic quota', 'QuotaExceededError')}",
    }
    for label, script in cases.items():
        context, page, errors, external = fresh_page(browser, url, init_script=script)
        try:
            if label == "getter":
                expect(page.locator("#status")).to_contain_text("Browser storage is unavailable")
            page.select_option("#mode", "mosaic")
            page.click("#undo")
            expect(page.locator("#mode")).to_have_value("equal")
            assert_clean(errors, external)
            passed("usable in-memory demo when storage " + label + " fails")
        finally:
            context.close()


def main():
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    result = {"checks": CHECKS, "real_data": False, "external_sources": False}
    try:
        executable = os.environ.get("QWEN_BROWSER_EXECUTABLE") or shutil.which("google-chrome") or shutil.which("chromium")
        if not executable:
            raise RuntimeError("An installed Chromium browser is required; this check does not install one.")
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=executable, headless=True, args=["--no-sandbox"])
            try:
                result["browser_version"] = browser.version
                url = "http://127.0.0.1:%d/demo/" % server.server_port
                check_layouts(browser, url)
                check_history_and_controls(browser, url)
                check_presentation(browser, url)
                check_optional_storage(browser, url)
            finally:
                browser.close()
        result["passed"] = True
    except Exception as error:
        result.update(passed=False, error=str(error))
        raise
    finally:
        server.shutdown()
        server.server_close()
        (ARTIFACTS / "browser-results.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result))


if __name__ == "__main__":
    main()
