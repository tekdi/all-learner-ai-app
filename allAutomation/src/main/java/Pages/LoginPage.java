package Pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import utils.javautils.BaseUtils;
import utils.javautils.PropertiesFileManager;

import java.util.Properties;

public class LoginPage extends BaseUtils {
    public LoginPage(WebDriver driver)
    {
        BaseUtils.driver = driver;
    }



    PropertiesFileManager loader = PropertiesFileManager.getInstance();
    static String locatorsPath=System.getProperty("user.dir")+"/src/test/java/test/resources/locators/";

    static {
        PropertiesFileManager.getInstance().setPath(locatorsPath);
    }
    Properties Login_Locators = loader.getProperties("login.properties");

    By Log_SignIn_Button =By.xpath(Login_Locators.getProperty("Log_SignIn_Button"));
    By Username =By.id(Login_Locators.getProperty("Username"));
    By Password =By.id(Login_Locators.getProperty("Password"));
    By LogIn_Button =By.id(Login_Locators.getProperty("Login_Button"));
    By Home_Button = By.xpath(Login_Locators.getProperty("Home_Button"));

    public void ClickonLog_SigninButton()
    {
        WebElement log_signIn_button = driver.findElement(Log_SignIn_Button);
        Click(log_signIn_button);
//        Click(driver.findElement(Log_SignIn_Button));
    }

    public void EnterUsername(String username)
    {
        SendTextOnUI(driver.findElement(Username),username);
    }

    public void EnterPassword(String password)
    {
        SendTextOnUI(driver.findElement(Password),password);

    }

    public void ClickOnLoginButton()
    {

        Click(driver.findElement(LogIn_Button));
    }



    public String getTextfromUI(String locator)
    {
        switch(locator)
        {
            case "HomeBUtton" : return driver.findElement(Home_Button).getText();
        }
        return null;
    }

    public boolean IsDisplayed(String Locator)
    {
        switch(Locator)
        {
            case "HomeBUtton" : return isElementDisplayed(driver.findElement(Home_Button));
        }
        return false;
    }


    public boolean IsEnabled(String locator)
    {
        switch (locator)
        {
            case "Log_SignIn_Button" : return isElementEnabled(driver.findElement(Log_SignIn_Button));
            case "Username" : return isElementEnabled(driver.findElement(Username));
            case "Password" : return isElementEnabled(driver.findElement(Password));
            case "Login_Button" : return isElementEnabled(driver.findElement(LogIn_Button));
        }
        return false;
    }

}
