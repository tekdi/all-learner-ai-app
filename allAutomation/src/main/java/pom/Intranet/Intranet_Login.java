package pom.Intranet;

import com.aventstack.extentreports.Status;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import utils.baseutils.BrowserManager;
import utils.javautils.LoggerUtil;
import utils.javautils.PropertiesFileManager;
import utils.javautils.Reporter;

import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.Properties;
import java.util.logging.Logger;

public class Intranet_Login extends BrowserManager {

    PropertiesFileManager loader = PropertiesFileManager.getInstance();

    static String locatorsPath=System.getProperty("user.dir")+"/src/test/java/test/resources/locators/";


    public Intranet_Login(WebDriver driver)
    {
        this.driver=driver;
    }
    //..............load properties file

    static {
        PropertiesFileManager.getInstance().setPath(locatorsPath);
    }

    private static final Logger LOGGER = LoggerUtil.getLogger();

    Properties Intranet_Locators = loader.getProperties("Intranet_Locators.properties");


    //............Pom elements fetched from properties file

    By username=By.xpath(Intranet_Locators.getProperty("username"));
    By password=By.xpath(Intranet_Locators.getProperty("password"));
    By loginBtn=By.xpath(Intranet_Locators.getProperty("loginBtn"));



    //..........Actions taken on the webElements

    public void openURL() throws IOException, InterruptedException {
        FileReader fr= new FileReader(System.getProperty("user.dir")+"/src/test/java/test/resources/Test_data/browserConfig.properties");

        Properties prop = new Properties();

        prop.load(fr);

        driver.get(prop.getProperty("URL"));
        Thread.sleep(3000);
    }



    //Entering Username
    public void enterUsername(String un)
    {
        driver.findElement(username).sendKeys(un);
        logStep("Entering Username");
    }
    //Entering Password
    public void enterPassword(String pw)
    {
       driver.findElement(password).sendKeys(pw);
       logStep("Entering Password");
    }

    //Clicking Log in


    public void loginBtn()  {
        driver.findElement(loginBtn).click();
        logStep("Clicking Login");
    }




    public void commonLogin(String un, String pw) {
        try {
            LOGGER.info("Executing common login ...");
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
            openURL();
            enterUsername(un);
            enterPassword(pw);
            loginBtn();
            LOGGER.info("Common Log in successful.");
            Reporter.logStep( "Common Log in successful.");


        } catch (Exception e) {
            LoggerUtil.logException(e, "Exception occurred during login.");
        }
    }


    }
