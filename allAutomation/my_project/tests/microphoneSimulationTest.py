import wave

import pyaudio

from BrowserManager import setup
from BrowserManager import test_open_website

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import os
import base64
import shutil


def logStep(step_description):
    print(step_description)


# Utility function for waiting
def waitForUi(seconds):
    time.sleep(seconds)


def test_microphone_simulation(setup):
    # Use the setup fixture to initialize the WebDriver
    driver = setup

    # Call the test_open_website function to perform the basic test
    test_open_website(setup)

    driver = setup

    # Call the test_open_website function to perform the basic test
    test_open_website(setup)

    # Enter username
    logStep("Enter username")
    driver.find_element(By.ID, ":r0:").send_keys("Amol")

    # Wait for UI to update
    waitForUi(2)

    # Enter password
    logStep("Enter password")
    driver.find_element(By.ID, ":r1:").send_keys("Amol@123")

    # Click on the Login button
    logStep("Click on the Login button")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    # Wait for UI to update
    time.sleep(3)

    # Click on Start assessment button
    logStep("Click on Start assessment button")
    start_button = driver.find_element(By.XPATH, "//div[@class='MuiBox-root css-14j5rrt']")
    start_button.click()

    # Wait for the UI to update
    time.sleep(10)

    # Get Text from UI
    logStep("Get Text from UI")
    text_element = driver.find_element(By.XPATH, "//h4[@class='MuiTypography-root MuiTypography-h5 css-xilszg']")
    assert text_element.is_displayed(), "Mike button is not enabled"

    text = text_element.text
    logStep(text)

    time.sleep(3)

    # Click on the Mike button
    logStep("Click on the Mike button")
    mike_button = driver.find_element(By.XPATH, "//*[@class='MuiBox-root css-1l4w6pd']")
    mike_button.click()

    time.sleep(3)

    # play_audio('E:/ALLPython/my_project/tests/output_audio.wav')
    play_audio('output_audio.wav')
    # speak_text(text)


    time.sleep(3)

    # Speak text in Mike (Placeholder, as actual implementation will differ)
    logStep("Speak text in Mike")
    # TexttoSpeach(text)  # Placeholder for actual text-to-speech implementation

    # Click on Stop button
    logStep("Click on Stop button")
    driver.find_element(By.XPATH, "(//*[@xmlns='http://www.w3.org/2000/svg'])[2]").click()

    # Click on Next Button
    logStep("Click on Next Button")
    next_button = driver.find_element(By.XPATH, "//*[@class='MuiBox-root css-140ohgs']")
    next_button.click()


def play_audio(file_path):
    chunk = 1024
    wf = wave.open(file_path, 'rb')
    p = pyaudio.PyAudio()
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True)
    data = wf.readframes(chunk)
    while data:
        stream.write(data)
        data = wf.readframes(chunk)
    stream.stop_stream()
    stream.close()
    p.terminate()


def speak_text(text):
    from comtypes.client import CreateObject
    engine = CreateObject("SAPI.SpVoice")
    stream = CreateObject("SAPI.SpFileStream")
    stream.Open("output_audio.wav", 3, False)
    engine.AudioOutputStream = stream
    engine.speak(text)
    stream.Close()
