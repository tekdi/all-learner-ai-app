package Tests;

import Pages.LoginPage;
import com.sun.speech.freetts.Voice;
import com.sun.speech.freetts.VoiceManager;
import com.sun.speech.freetts.audio.SingleFileAudioPlayer;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;
import utils.baseutils.BrowserManager;
import utils.javautils.BaseUtils;

import javax.sound.sampled.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Base64;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;


public class AllTest extends BrowserManager {

    public AllTest() {
        System.out.println("AllTest constructor called.");
    }


    @Test
    public static void Login() throws Exception {
        browserRun();
        LoginPage lp = PageFactory.initElements(BaseUtils.driver, LoginPage.class);

        logStep("Enter username");
        driver.findElement(By.id(":r0:")).sendKeys("Amol");

        waitForUi(2);
        logStep("Enter password");
        driver.findElement(By.id(":r1:")).sendKeys("Amol@123");

        logStep("Click on the Login button");
        driver.findElement(By.xpath("//button[@type='submit']")).click();

        waitForUi(2);
        Thread.sleep(3000);
        logStep("Click on Start assessment button");
        WebElement startButton = driver.findElement(By.xpath("//div[@class='MuiBox-root css-14j5rrt']"));
        startButton.click();

        Thread.sleep(3000);
        logStep("Get Text from UI");
        WebElement textElement = driver.findElement(By.xpath("//h4[@class='MuiTypography-root MuiTypography-h5 css-xilszg']"));
        assertTrue("Mike button is enabled", textElement.isDisplayed(),"Mike button is not enabled");

        String text = textElement.getText();
        logStep(text);
        String audioFilePath = "src/main/java/Pages/output_audio.wav";
        logStep("Click on the Mike button");
        WebElement mikeButton = driver.findElement(By.xpath("//*[@class='MuiBox-root css-1l4w6pd']"));
        mikeButton.click();
        logStep("Speak text in Mike");
//        TexttoSpeach(text);
        Thread.sleep(4000);

        injectAudioFile("src/main/java/Pages/output_audio.wav");
        Thread.sleep(4000);
        logStep("Click on Stop button");
        driver.findElement(By.xpath("(//*[@xmlns='http://www.w3.org/2000/svg'])[2]")).click();
        Thread.sleep(2000);
        Thread.sleep(4000);
        logStep("Click on Next Button");
//        WebElement nextButton = driver.findElement(By.xpath("//*[@class='MuiBox-root css-140ohgs']"));
//        nextButton.click();

    }

    private static void injectAudioFile(String relativeFilePath) throws IOException {
        logStep("Speaking text in mike");
        Path absolutePath = Paths.get(relativeFilePath).toAbsolutePath();
        File file = absolutePath.toFile();
        byte[] fileContent = Files.readAllBytes(file.toPath());
        String encodedString = Base64.getEncoder().encodeToString(fileContent);

        String script = "async function simulateAudioInput(base64Audio) {"
                + "const audioContext = new AudioContext();"
                + "const response = await fetch(`data:audio/wav;base64,${base64Audio}`);"
                + "const arrayBuffer = await response.arrayBuffer();"
                + "const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);"
                + "const source = audioContext.createBufferSource();"
                + "source.buffer = audioBuffer;"
                + "const destination = audioContext.createMediaStreamDestination();"
                + "source.connect(destination);"
                + "source.start();"
                + "navigator.mediaDevices.getUserMedia = async function(constraints) {"
                + "if (constraints.audio) {"
                + "return new Promise((resolve) => {"
                + "resolve({ getTracks: () => destination.stream.getTracks() });"
                + "});"
                + "}"
                + "return navigator.mediaDevices.originalGetUserMedia(constraints);"
                + "};"
                + "}"
                + "simulateAudioInput('" + encodedString + "');";

        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
        jsExecutor.executeScript(script);
        logStep("Speaking text in mike");
    }

    private static String convertWavToBase64(String filePath) {
        String base64String = "";
        try {
            File file = new File(filePath);
            byte[] bytes = Files.readAllBytes(file.toPath());
            base64String = Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64String;
    }

    private static void saveBase64ToFile(String filePath, String base64String) {
        try (FileWriter fileWriter = new FileWriter(filePath)) {
            fileWriter.write(base64String);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void clickElementUsingJavaScript(WebElement element) {
        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
        jsExecutor.executeScript("arguments[0].click();", element);
    }


}
