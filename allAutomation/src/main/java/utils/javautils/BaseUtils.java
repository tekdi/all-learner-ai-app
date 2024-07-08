package utils.javautils;

import org.apache.commons.collections4.Closure;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.function.Consumer;

import java.time.Duration;
import java.util.logging.Logger;

public class BaseUtils {
    public static WebDriver driver;
    public static ThreadLocal<WebDriver> threadDriver = new ThreadLocal<WebDriver>();
    public static final int DEFAULT_WAIT_IN_SECS = Integer.parseInt(System.getProperty("default.wait.secs", "150"));
    public static final int maxRetries = 5;
    static boolean shouldMaximizeWindows;
    public static final Dimension SYS_DEFAULT_WINDOW_SIZE = new Dimension(1280, 1024);  // 1280x1024 is the minimum supported resolution (as of Aug2014)
    static String userAgentString;
    static Dimension defaultWindowSize;




    private static final Logger LOGGER = LoggerUtil.getLogger();



    /*Logger methods*/
    /*------------------------------------------------------*/
    public static void logStep(String log)
    {

        LOGGER.info(log);
        Reporter.logStep(log);
    }

    static void logDebug(String message) {
        //Reporter.log('DEBUG: ' + message)
        LOGGER.info("    " + message);
    }

    static void warning(String message) {
        LOGGER.warning(message);
    }

    static void fail(String message) {
        LOGGER.info(message);
//        Reporter.logFail(message,driver);
    }

    static void pass(String message)
    {
//        Reporter.logPass(message);
        LOGGER.info(message);
    }

    public static void logException(String exception) {
        Reporter.logStep("EXCEPTION: " + exception.toString());
        LOGGER.severe("  " + exception.toString());
    }

    public static void logAssertion(String message) {
        Reporter.logStep("ASSERTION: " + message);
        LOGGER.info("  " + message);
        Reporter.logStep(message);

    }


    /*Assertions*/

    public static void assertEquals(String assertMessage, Object param1, Object param2, String failureMessage) {
        // Log the assertion message
        logAssertion(assertMessage + " -- assertEquals(" + param1.toString() + " <---> " + param2.toString() + ")");

        try {
            // Perform the assertion
            Assert.assertEquals(param1.toString(), param2.toString(), failureMessage);
        } catch (AssertionError e) {
            // Log the failure message
            logAssertion("Assertion Failed: " + e.getMessage());
            // Re-throw the assertion error
            throw e;
        }
    }

    public static boolean assertNotEquals(String assertMessage, Object param1, Object param2, String failureMessage) {
        // Log the assertion message
        logAssertion(assertMessage + " -- assertNotEquals(" + param1.toString() + " <---> " + param2.toString() + ")");

        try {
            // Perform the not equals check
            if (!param1.equals(param2)) {
                logAssertion("Assertion Passed: Arguments are not equal");
                return true;
            } else {
                logAssertion("Assertion Failed: Arguments are equal");
                return false;
            }
        } catch (Exception e) {
            // Log the exception message
            logAssertion("Exception occurred: " + e.getMessage());
            throw e;
        }
    }


    public static boolean assertTrue(String assertMessage, boolean condition, String failureMessage) {
        // Log the assertion message
        logAssertion(assertMessage + " -- assertTrue(" + condition + ")");

        if (!condition) {
            // Log the failure message
            fail(failureMessage);
            // Assert the condition
            Assert.assertTrue(condition, failureMessage);
        }
        return condition;
    }



    /*Selenium REusable methods*/
    /*------------------------------------------------------*/

    public static boolean Click(WebElement element)
    {
        try
        {
            element.click();
            return true;
        }
        catch (Exception e)
        {
            logException("Exception while clicking on the element" +e.getMessage());
            return false;
        }
    }

    public static void SendTextOnUI(WebElement element, String text)
    {
        try
        {
            element.sendKeys(text);
        }
        catch (Exception e)
        {
            logException("Exception while sending text to the element" + e.getMessage());
        }
    }

    public static void clickElementByText(String visibleText) {
        try {
            // Construct the XPath expression to locate the element by its visible text
            String xpathExpression = "//li[text()='" + visibleText + "']";

            // Find the element using the XPath expression
            WebElement element = driver.findElement(By.xpath(xpathExpression));

            // Assert that the element is displayed
            if (element.isDisplayed()) {
                System.out.println("Element with text '" + visibleText + "' is displayed.");
                // Click the element
                element.click();
            } else {
                System.out.println("Element with text '" + visibleText + "' is not displayed.");
            }
        } catch (org.openqa.selenium.NoSuchElementException e) {
            // Handle the case when the element is not found
            System.out.println("Element with text '" + visibleText + "' not found.");
            e.printStackTrace();
        }
    }

    public static boolean isChecked(WebElement element) {
        try {
            if (!element.isSelected()) {
                element.click();
            }
            String checked = element.getAttribute("checked");
            return checked != null && checked.equals("true");
        } catch (Exception e) {
            logException("Exception in isChecked: " + e.getMessage());
            // Handle the error more gracefully, depending on your use case
            return false;
        }
    }

    public boolean clickOnceClickable(WebElement element, int maxRetries, int waitTimeInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(waitTimeInSeconds));

        for (int i = 0; i < maxRetries; i++) {
            try {
                wait.until(ExpectedConditions.elementToBeClickable(element));
                element.click();
                return true;
            } catch (Exception e) {
                logException("Retry " + (i + 1) + " - Element is not clickable yet: " + e.getMessage());
            }
        }
        // If max retries reached and element is still not clickable, return false
        logException("Element is not clickable after " + maxRetries + " retries.");
        return false;
    }

    /*Re-usable window handle methods*/
    public void openNewWindow(String url) {
        // driver.findElement(By.cssSelector("body")).sendKeys(Keys.CONTROL +"t");
        ((JavascriptExecutor) driver).executeScript("window.open()");

        // Switch to the new tab
        String originalHandle = driver.getWindowHandle();
        for (String handle : driver.getWindowHandles()) {
            if (!handle.equals(originalHandle)) {
                driver.switchTo().window(handle);
                break;
            }
        }
        driver.get(url);
    }

    public void switchToNewWindow() {
        try {
            // Get all window handles
            Object[] windowHandles = driver.getWindowHandles().toArray();
            // Assuming the new window is the second window (index 1)
            String newWindowHandle = (String) windowHandles[1];
            // Switch to the new window
            driver.switchTo().window(newWindowHandle);
        } catch (Exception e) {
            // Log the exception
            logException("Exception occurred while switching to a new window: "+ e.getMessage());
        }
    }

    public void closeNewWindowAndSwitchBack() {
        try {
            // Save the current window handle
            String originalWindowHandle = driver.getWindowHandle();
            // Close the current window
            driver.close();
            // Switch back to the original window
            driver.switchTo().window(originalWindowHandle);
        } catch (Exception e) {
            logException("Exception occurred while closing a new window and switching back: " + e.getMessage());
        }
    }

    static void switchToDefaultContent()
    {
        try
        {
            driver.switchTo().defaultContent();
        }
        catch (Exception e)
        {
            logException("Exception occurred while switching to default content: " + e.getMessage());
        }
    }


    /*Webdriver Wait for element synchronisation*/

    static void ImpliciteWait(int WaitTimeinSeconds) {
        try
        {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(WaitTimeinSeconds));
        }
        catch (Exception e)
        {
            //            Logger.logException "Exception in implicitWait: ${e.message}"
        }
    }



    public static void retryUntilInteractable(WebDriver driver, By locator, Consumer<WebElement> methodToRetry) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                WebElement element = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT_IN_SECS))
                        .until(ExpectedConditions.elementToBeClickable(locator));
                if (element != null) {
                    methodToRetry.accept(element);
                    break;
                }
            } catch (Exception e) {
                if (i < maxRetries - 1) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        logException("Interrupted while waiting to retry: " + ie.getMessage());
                        return;
                    }
                    driver.navigate().refresh();
                } else {
                    logException("Max retries reached. Element located by " + locator + " is not clickable.");
                }
            }
        }
    }


    public static void waitForElementToBeVisible(WebDriver driver, By locator, int timeoutInSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        } catch (Exception e) {
            logException("Exception in waitForVisible: " + e.getMessage());
        }
    }

    public static void waitForTextInElement(WebDriver driver, By locator, String text, int timeoutInSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
        } catch (Exception e) {
            logException("Exception in waitForTextInElement: " + e.getMessage());
        }
    }

    public static void waitForElementToBePresent(WebDriver driver, By locator, int timeoutInSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        } catch (Exception e) {
            logException("Exception in waitForElementPresent: " + e.getMessage());
        }
    }

    public static boolean scrollToElement(WebDriver driver, By locator) {
        try {
            WebElement element = driver.findElement(locator);
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            return true;
        } catch (Exception e) {
            logException("Exception in scrollToElement: " + e.getMessage());
            return false;
        }
    }


    /*Popup Handling methods*/
    /*--------------------------------------------------------------------------------*/

    public static String acceptPopupMessage(WebDriver driver) {
        String message = null;
        try {
            Alert alert = driver.switchTo().alert();
            message = alert.getText();
            alert.accept();
        } catch (Exception e) {
            logException("Exception in acceptPopupMessage: " + e.getMessage());
            // You might want to handle the error more gracefully, depending on your use case
        }
        return message;
    }

    public static String dismissPopupMessage(WebDriver driver) {
        String message = null;
        try {
            Alert alert = driver.switchTo().alert();
            message = alert.getText();
            alert.dismiss();
        } catch (Exception e) {
            // Handle exception gracefully, optionally log it
            message = null;
        }
        return message;
    }

    /*Window Handling methods*/
    /*--------------------------------------------------------------------------------*/

    protected static void resizeWindowToDefault(WebDriver driver) {
        try {
            if (shouldMaximizeWindows) {
                driver.manage().window().maximize();
            } else {
                Dimension defaultWindowSize = new Dimension(1280, 800);
                driver.manage().window().setSize(defaultWindowSize);
            }
        } catch (org.openqa.selenium.WebDriverException e) {
            // Handle WebDriverException specifically for window management issues
            logException("WebDriverException in resizeWindowToDefault: " + e.getMessage());
        } catch (Exception e) {
            // Catch any other exceptions that might occur
            logException("Exception in resizeWindowToDefault: " + e.getMessage());
        }
    }

    protected static Map<String, Integer> getHeightInfo(WebDriver driver) {
        try {
            JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
            String script = "return window.screen.height + ':' + window.innerHeight + ':' + (window.outerHeight - window.innerHeight);";
            String[] info = ((String) jsExecutor.executeScript(script)).split(":");

            int screenPx = Integer.parseInt(info[0]);
            int viewportPx = Integer.parseInt(info[1]);
            int windowBorderPx = Integer.parseInt(info[2]);

            Map<String, Integer> heightInfo = new HashMap<>();
            heightInfo.put("screenHeight", screenPx);
            heightInfo.put("viewportHeight", viewportPx);
            heightInfo.put("windowBorderHeight", windowBorderPx);

            return heightInfo;
        } catch (Exception e) {
            logException("Exception in getHeightInfo: " + e.getMessage());
            Map<String, Integer> errorInfo = new HashMap<>();
            errorInfo.put("screenHeight", -1);
            return errorInfo;
        }
    }

    public static boolean closeWindow(WebDriver driver) {
        logStep("Closing window: " + driver.getTitle());
        try {
            driver.close();
            return true;
        } catch (Exception e) {
            logException("Exception while closing the window: " + e.getMessage());
            return false;
        }
    }

    private static void resetWindowSizeToSystemDefault(WebDriver driver) {
        try {
            setWindowDefaultSize(driver, SYS_DEFAULT_WINDOW_SIZE);
        } catch (Exception e) {
            logException("Exception in resetWindowSizeToSystemDefault: " + e.getMessage());
            // Handle the error more gracefully, depending on your use case
        }
    }

    private static void setWindowDefaultSize(WebDriver driver, Dimension size) {
        try {
            Dimension widthInfo = (Dimension) getWidthInfo(driver);

            if (widthInfo.getWidth() > 0) {
                if (widthInfo.getWidth() == size.getWidth() && !userAgentString.contains("Mac")) {
                    shouldMaximizeWindows = true;
                } else if (widthInfo.getWidth() > 0) {
                    // Account for the window borders when sizing
                    size = new Dimension(size.getWidth() + widthInfo.getWidth(), size.getHeight());
                }
            }
            defaultWindowSize = size;
        } catch (Exception e) {
            logException("Exception in setWindowDefaultSize: " + e.getMessage());
        }
    }

    protected static Map<String, Integer> getWidthInfo(WebDriver driver) {
        try {
            JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
            String script = "return window.screen.width + ':' + window.innerWidth + ':' + (window.outerWidth - window.innerWidth);";
            String[] info = ((String) jsExecutor.executeScript(script)).split(":");

            int screenPx = Integer.parseInt(info[0]);
            int viewportPx = Integer.parseInt(info[1]);
            int windowBorderPx = Integer.parseInt(info[2]);

            Map<String, Integer> widthInfo = new HashMap<>();
            widthInfo.put("screenWidth", screenPx);
            widthInfo.put("viewportWidth", viewportPx);
            widthInfo.put("windowBorderWidth", windowBorderPx);

            return widthInfo;
        } catch (Exception e) {
            logException("Exception in getWidthInfo: " + e.getMessage());
            Map<String, Integer> errorInfo = new HashMap<>();
            errorInfo.put("screenWidth", -1);
            return errorInfo;
        }
    }


    public static boolean closeAllOtherWindows() {
        String originalHandle = driver.getWindowHandle();
        try {
            Set<String> handles = driver.getWindowHandles();
            for (String handle : handles) {
                if (!handle.equals(originalHandle)) {
                    driver.switchTo().window(handle);
                    closeWindow(driver); // Assuming you have a method to close the current window
                }
            }
            driver.switchTo().window(originalHandle);
            return true;
        } catch (Exception e) {
            logException("Failed closing windows in closeAllOtherWindows: " + e.getMessage());
            return false;
        } finally {
            try {
                driver.switchTo().window(originalHandle);
            } catch (Exception e) {
                // Handle exception if needed, but usually not necessary in finally block
            }
        }
    }


    public static void retryUntilInteractable(WebDriver driver, By locator, Runnable methodToRetry) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                WebElement element = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT_IN_SECS))
                        .until(ExpectedConditions.elementToBeClickable(locator));
                if (element != null) {
                    methodToRetry.run();
                    break;
                }
            } catch (Exception e) {
                if (i < maxRetries - 1) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException interruptedException) {
                        Thread.currentThread().interrupt(); // Reset the interrupted status
                        logException("Thread was interrupted: " + interruptedException.getMessage());
                    }
                    driver.navigate().refresh();
                } else {
                    logException("Max retries reached. Element located by " + locator + " is not clickable.");
                }
            }
        }
    }

    public static boolean waitForUi(int timeoutSecs) {
        try {
            if (driver.findElements(By.className("SimpleLoader")).isEmpty()) {
                return true;
            } else {
                int count = driver.findElements(By.className("SimpleLoader")).size();
                if (count > 0) {
                    return betterWait(() -> driver.findElements(By.className("SimpleLoader")).size() < count, timeoutSecs);
                }
            }
        } catch (Exception e) {
            logException("Exception in waitForUi: " + e.getMessage());
            // Handle the error more gracefully, depending on your use case
            return false;
        }
        return false; // Default return if the above conditions are not met
    }


    public static boolean betterWait(Callable<Boolean> conditionCheck, int timeoutSecs) {
        final int MAX_STALE_ELEMENT_RETRIES = 10;
        int retries = 1;
        while (true) {
            try {
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSecs));
                wait.until(new ExpectedCondition<Boolean>() {
                    @Override
                    public Boolean apply(WebDriver input) {
                        try {
                            return conditionCheck.call();
                        } catch (Exception e) {
                            logException("Exception in conditionCheck: " + e.getMessage());
                            return false;
                        }
                    }
                });
                return true;
            } catch (TimeoutException te) {
                logDebug("TimeoutException in betterWait");
                return false;
            } catch (StaleElementReferenceException | NoSuchElementException e) {
                if (retries < MAX_STALE_ELEMENT_RETRIES) {
                    logException("betterWait failed with Stale or NoSuchElementException. Tried '" + retries + "' number(s) to recover");
                    retries++;
                } else {
                    logException("betterWait failed with Stale or NoSuchElementException. Tried '" + retries + "' number(s) to recover: \n" + e.getMessage());
                    return false;
                }
            } catch (Exception e) {
                logException("betterWait failed with exception: " + e.getMessage());
                return false;
            }
        }
    }



    /*Element Condition checck methods*/
    /*----------------------------------------------------------------*/
    public static boolean isElementDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException | TimeoutException e) {
            return false;
        }
    }

    public static boolean isElementEnabled(WebElement locator) {
        try {
//            WebElement element = driver.findElement(locator);
            return locator.isEnabled();
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isElementEnabled: " + e.getMessage());
            // Exception is caught to prevent it from being propagated. Return false if the element is not enabled or not present.
            return false;
        }
    }

    public static boolean isElementSelected(By locator) {
        try {
            WebElement element = driver.findElement(locator);
            return element.isSelected();
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isElementSelected: " + e.getMessage());
            return false;
        }
    }

    public static boolean isElementNotSelected(By locator) {
        try {
            return !driver.findElement(locator).isSelected();
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isElementNotSelected: " + e.getMessage());
            return true;
        }
    }

    public static boolean isTextPresent(String text) {
        try {
            return driver.getPageSource().contains(text);
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isTextPresent: " + e.getMessage());
            return false;
        }
    }

    public static boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (NoSuchElementException e) {
            logException("Exception in isElementPresent: " + e.getMessage());
            return false;
        }
    }

    public static boolean isDropdownPresent(By dropdownLocator) {
        try {
            return driver.findElement(dropdownLocator).isDisplayed();
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isDropdownPresent: " + e.getMessage());
            return false;
        }
    }

    public static boolean isOptionPresentInDropdown(By dropdownLocator, String optionText) {
        try {
            WebElement dropdown = driver.findElement(dropdownLocator);
            Select select = new Select(dropdown);
            List<WebElement> options = select.getOptions();

            for (WebElement option : options) {
                if (option.getText().equals(optionText)) {
                    return true;
                }
            }
            return false;
        } catch (NoSuchElementException | ElementNotInteractableException e) {
            logException("Exception in isOptionPresentInDropdown: " + e.getMessage());
            return false;
        }
    }

    /*iFrame reusable methods*/
    /*---------------------------------------------------------------------------------------------*/


    public static boolean switchToFrame(WebElement frame) {
        try {
            driver.switchTo().frame(frame);
            return true;
        } catch (Exception e) {
            logException("Exception in switchToFrame: " + e.getMessage());
            // Exception is caught to prevent it from being propagated. Return false if there is an issue switching to the frame.
            return false;
        }
    }

    public static void switchToFrameWithWait(WebDriver driver, By frameLocator) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT_IN_SECS));
            WebElement frameElement = wait.until(ExpectedConditions.presenceOfElementLocated(frameLocator));
            driver.switchTo().frame(frameElement);
        } catch (NoSuchFrameException e) {
            logException("Frame not found: " + e.getMessage());
        } catch (InvalidSelectorException e) {
            logException("Invalid frame selector: " + e.getMessage());
        }
    }

    public static boolean switchFrameByClass(String className) {
        try {
            WebElement frameElement = null;
            for (WebElement iframe : driver.findElements(By.tagName("iframe"))) {
                if (iframe.getAttribute("class").equalsIgnoreCase(className)) {
                    frameElement = iframe;
                    break;
                }
            }

            if (frameElement != null) {
                driver.switchTo().frame(frameElement);
                return true;
            } else {
                logException("Frame with class '" + className + "' not found.");
                return false;
            }
        } catch (Exception e) {
            logException("Exception in switchFrameByClass: " + e.getMessage());
            return false;
        }
    }

    public static void quitBrowser() {
        waitForUi(DEFAULT_WAIT_IN_SECS);
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            logException("An exception occurred while quitting the browser: " + e.getMessage());
        }
    }


    /*Drag and drop method*/
    /*--------------------------------------------------------------*/

    public static void performDragAndDrop(WebElement sourceLocator, WebElement targetLocator) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_WAIT_IN_SECS));

        // Wait for source element to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(sourceLocator));

        // Perform click and hold on the source element
        Actions actions = new Actions(driver);
        actions.clickAndHold(sourceLocator).perform();

        // Wait for the source element to be draggable
        wait.until(ExpectedConditions.attributeContains(sourceLocator, "draggable", "true"));

        // Wait for target element to be present
        wait.until(ExpectedConditions.presenceOfElementLocated((By) targetLocator));

        // Perform drag and drop to the target element
        actions.moveToElement(targetLocator).release().build().perform();
    }
}
