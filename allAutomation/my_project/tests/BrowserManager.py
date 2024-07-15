import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="module")
def setup():
    # Initialize ChromeOptions
    options = Options()
    options.add_argument("--headless")  # Run Chrome in headless mode
    options.add_argument("--no-sandbox")  # Bypass OS security model
    options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--disable-gpu")
    options.add_argument("--remote-allow-origins=*")
    options.add_argument("--incognito")
    options.add_argument("--use-fake-ui-for-media-stream")
    options.add_argument("--use-file-for-fake-audio-capture=path/to/audio/file.wav")
    # options
    # Uncomment and set the correct path to load extension
    # options.add_argument("load-extension=path/to/extension")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    yield driver

    driver.maximize_window()

    # Return the WebDriver instance for the tests to use
    # yield driver

    # Teardown - Close the browser
    # driver.quit()


def test_open_website(setup):
    driver = setup  # Using the WebDriver instance from setup fixture

    # Open a website
    driver.get('https://d114esnbvw5tst.cloudfront.net/')
