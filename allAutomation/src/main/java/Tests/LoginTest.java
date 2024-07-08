package Tests;

import Pages.LoginPage;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import utils.baseutils.BrowserManager;
import utils.javautils.BaseUtils;

public class LoginTest extends BrowserManager
{


    @Test
    public static void Login() throws Exception {
        browserRun();
        LoginPage lp = PageFactory.initElements(BaseUtils.driver,LoginPage.class);

        logStep("Click on the log/SignIn button");
        assertTrue("Log_SignIn_Button is Enabled", lp.IsEnabled("Log_SignIn_Button"),"Log_SignIn_Button is Disabled");
        lp.ClickonLog_SigninButton();

        logStep("Enter Username");
        assertTrue("Username field is Enabled", lp.IsEnabled("Username"),"Username field is Disabled");
        lp.EnterUsername("nulpcreator@gmail.com");

        logStep("Enter Password");
        assertTrue("Password field is Enabled", lp.IsEnabled("Password"),"Username field is Password");
        lp.EnterPassword("Nulp@123");

        logStep("Click on LogIn Button");
        assertTrue("Login_Button is Enabled", lp.IsEnabled("Login_Button"),"Login_Button is Disabled");
        lp.ClickOnLoginButton();

        String Home = "Home";

        Thread.sleep(5000);

        assertEquals("Home button is dispalyed on the Dashboard",lp.getTextfromUI("HomeBUtton"),Home,"Home button is dispalyed on the Dashboard");

    }

}
