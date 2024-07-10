package Tests;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;

public class AudioRecorder {

    static AudioFormat getAudioFormat() {
        float sampleRate = 44100;
        int sampleSizeInBits = 16;
        int channels = 2;
        boolean signed = true;
        boolean bigEndian = false;
        return new AudioFormat(sampleRate, sampleSizeInBits, channels, signed, bigEndian);
    }

    public static void main(String[] args) {
        // Specify the duration of the recording (in milliseconds)
        int recordTime = 10000; // 10 seconds

        // Define the target data line (microphone)
        AudioFormat format = getAudioFormat();
        DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);

        if (!AudioSystem.isLineSupported(info)) {
            System.out.println("The line is not supported.");
            System.exit(0);
        }

        try {
            // Open the target data line
            TargetDataLine microphone = (TargetDataLine) AudioSystem.getLine(info);
            microphone.open(format);
            microphone.start();

            System.out.println("Recording...");

            // Create a thread to record the audio
            Thread stopper = new Thread(new Runnable() {
                public void run() {
                    AudioInputStream audioStream = new AudioInputStream(microphone);
                    File audioFile = new File("recorded_audio.wav");

                    try {
                        // Write the recorded audio to a WAV file
                        AudioSystem.write(audioStream, AudioFileFormat.Type.WAVE, audioFile);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });

            stopper.start();
            Thread.sleep(recordTime);
            microphone.stop();
            microphone.close();

            System.out.println("Recording completed.");

        } catch (LineUnavailableException | InterruptedException e) {
            e.printStackTrace();
        }
    }

}
