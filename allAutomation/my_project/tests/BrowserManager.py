import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="module")
def setup():
    # Initialize ChromeOptions
    chrome_options = ChromeOptions()
    chrome_options.add_argument('--headless')  # Uncomment to run Chrome in headless mode
    chrome_options.add_argument('--no-sandbox')  # Bypass OS security model
    chrome_options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--remote-allow-origins=*")
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument("--use-fake-ui-for-media-stream")
    chrome_options.add_argument("--use-file-for-fake-audio-capture")
    chrome_options.add_argument("--use-fake-ui-for-media-stream")
    chrome_options.add_argument("--use-file-for-fake-audio-capture=output_audio.wav")

    # Initialize Chrome WebDriver using WebDriverManager with a specific version
    service = Service(ChromeDriverManager(version=" 126.0.6478.127").install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.maximize_window()

    # Return the WebDriver instance for the tests to use
    yield driver

    # Teardown - Close the browser
    driver.quit()

def test_open_website(setup):
    driver = setup  # Using the WebDriver instance from setup fixture

    # Open a website
    driver.get('https://d114esnbvw5tst.cloudfront.net/')
    assert "Title of the website" in driver.title  # Adjust this assertion as needed
