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
//        driver.switchTo().alert().accept();



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
        TexttoSpeach(text);
        Thread.sleep(4000);

        injectAudioFile("src/main/java/Pages/output_audio.wav");

        Thread.sleep(4000);

        logStep("Click on Stop button");
        driver.findElement(By.xpath("(//*[@xmlns='http://www.w3.org/2000/svg'])[2]")).click();

        Thread.sleep(4000);

        logStep("Click on Next Button");
        WebElement nextButton = driver.findElement(By.xpath("//*[@class='MuiBox-root css-140ohgs']"));
        nextButton.click();

    }


    private static void TexttoSpeach(String Text) throws InterruptedException {
        System.setProperty("freetts.voices", "com.sun.speech.freetts.en.us.cmu_us_kal.KevinVoiceDirectory");

        logStep("Speak text in Mike");
        // Create a voice manager
        VoiceManager voiceManager = VoiceManager.getInstance();

        // Select the voice
        Voice voice = voiceManager.getVoice("kevin16");
        if (voice == null) {
            System.err.println("Cannot find a voice named kevin16.\n" +
                    "Please specify a different voice.");
            System.exit(1);
        }

        // Allocate the chosen voice
        voice.allocate();
        voice.speak(Text);

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


    private static void injectAudioFile(String relativeFilePath) {
        try {
            // Resolve the relative path to an absolute path
            Path absolutePath = Paths.get(relativeFilePath).toAbsolutePath();

            // Read the audio file and convert it to a Base64 string
            File file = absolutePath.toFile();
            byte[] fileContent = Files.readAllBytes(file.toPath());
            String encodedString = Base64.getEncoder().encodeToString(fileContent);

            // JavaScript to decode Base64 string and simulate microphone input
            String script = "var base64Data = '" + encodedString + "';" +
                    "var buffer = new ArrayBuffer(base64Data.length);" +
                    "var view = new Uint8Array(buffer);" +
                    "for (var i = 0; i < base64Data.length; i++) {" +
                    "    view[i] = base64Data.charCodeAt(i);" +
                    "}" +
                    "navigator.mediaDevices.getUserMedia({audio: true})" +
                    ".then(function(stream) {" +
                    "    var mediaRecorder = new MediaRecorder(stream);" +
                    "    var audioContext = new AudioContext();" +
                    "    var source = audioContext.createBufferSource();" +
                    "    audioContext.decodeAudioData(buffer, function(decodedData) {" +
                    "        source.buffer = decodedData;" +
                    "        source.connect(audioContext.destination);" +
                    "        source.start(0);" +
                    "    });" +
                    "    mediaRecorder.ondataavailable = function(e) {" +
                    "        var audio = new Audio();" +
                    "        audio.src = URL.createObjectURL(e.data);" +
                    "        audio.play();" +
                    "        document.body.appendChild(audio);" +
                    "    };" +
                    "    mediaRecorder.start();" +
                    "    setTimeout(function() {" +
                    "        mediaRecorder.stop();" +
                    "    }, 5000); // Adjust the duration as needed" +
                    "})" +
                    ".catch(function(err) {" +
                    "    console.error('Error accessing microphone:', err);" +
                    "});";

            // Execute the JavaScript in the context of the browser
            JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
            jsExecutor.executeScript(script);

            logStep("Audio injected into microphone simulation.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    private static void clickElementUsingJavaScript(WebElement element) {
        JavascriptExecutor jsExecutor = (JavascriptExecutor) driver;
        jsExecutor.executeScript("arguments[0].click();", element);
    }


}



//
//    String audioFilePath = "output.mp3";
////        convertTextToSpeech(Text,audioFilePath)