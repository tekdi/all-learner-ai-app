import os

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="module")
def setup():
    # Initialize ChromeOptions
    chrome_options = ChromeOptions()
    # chrome_options.add_argument('--headless')  # Uncomment to run Chrome in headless mode?
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
    # extension_Path = "E:/ALL_Automation_Git_Actions/all-learner-ai-app/allAutomation/my_project/tests/Manifest.zip"
    #
    # if os.path.exists(extension_Path):
    #     chrome_options.add_argument(f"--load-extension={extension_Path}")
    # else:
    #     raise FileNotFoundError(f"Extension directory not found at {extension_Path}")

    # Initialize Chrome WebDriver using WebDriverManager with a specific version
    service = Service(ChromeDriverManager().install())
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

    # Ensure the page has fully loaded
    driver.implicitly_wait(10)

    # Print the title for debugging purposes
    print("Page title is:", driver.title)


if __name__ == "__main__":
    extension_path = os.path.abspath("Manifest.zip")
    if not os.path.exists(extension_path):
        print(f"Manifest.zip not found at {extension_path}")
