import { prepareInstructions } from '~/constants';
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { UUID } from "~/lib/utlils";

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const handleAnalyzer = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      console.log("🚀 Analyzer Started");
      console.log("📄 Input Data:", { companyName, jobTitle, jobDescription, file });

      setStatusText("Uploading resume...");
      console.log("📤 Uploading Resume...");

      const uploadedFile = await fs.upload([file]);
      console.log("✅ Uploaded Resume Response:", uploadedFile);

      if (!uploadedFile) {
        console.error("❌ Resume upload failed");
        setStatusText("Error: Failed to upload file");
        return;
      }

      setStatusText("Converting PDF to image...");
      console.log("🖼 Converting PDF to Image...");

      const imageFile = await convertPdfToImage(file);
      console.log("🖼 Converted Image File:", imageFile);

      if (!imageFile?.file) {
        console.error("❌ PDF conversion failed");
        setStatusText("Error: Failed to convert PDF");
        return;
      }

      setStatusText("Uploading image...");
      console.log("📤 Uploading Image...");

      const uploadedImage = await fs.upload([imageFile.file]);
      console.log("✅ Uploaded Image Response:", uploadedImage);

      if (!uploadedImage) {
        console.error("❌ Image upload failed");
        setStatusText("Error: Failed to upload image");
        return;
      }

      setStatusText("Preparing data...");
      console.log("💾 Preparing KV Data...");

      const uuid = UUID();
      console.log("🆔 Generated UUID:", uuid);

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      console.log("💾 Saving Initial Data to KV:", data);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing resume...");
      console.log("🤖 Calling AI Feedback...");

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({
          jobTitle,
          jobDescription,
          AIResponseFormat: `
{
  "score": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "improvements": string[]
}
`,
        }),
      );

      console.log("🤖 AI Raw Response:", feedback);

      if (!feedback) {
        console.error("❌ AI analysis failed");
        setStatusText("Error: Failed to analyze resume");
        return;
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      console.log("📊 AI Feedback Text:", feedbackText);

      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        setStatusText("Error: AI returned invalid JSON");
        return;
      }

      console.log("💾 Saving Final Data with Feedback...");
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      console.log("✅ Analysis Complete. Redirecting...");
      setStatusText("Analysis complete. Redirecting...");

      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error("🔥 Unexpected Error:", error);
      setStatusText("Something went wrong.");
    } finally {
      console.log("🏁 Analyzer Finished");
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    console.log("📎 File Selected:", selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📝 Form Submitted");

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    console.log("📝 Extracted Form Data:", {
      companyName,
      jobTitle,
      jobDescription,
    });

    if (!file) {
      console.warn("⚠ No file selected");
      alert("Please upload a resume file.");
      return;
    }

    setIsProcessing(true);
    setStatusText("Starting analysis...");

    await handleAnalyzer({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat">
      <Navbar />

      <section className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8 sm:py-12 lg:py-16">

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Smart feedback for your{" "}
              <span className="text-purple-400">Dream job</span>
            </h1>

            {isProcessing ? (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 animate-pulse">
                  {statusText}
                </h2>
                <div className="max-w-md mx-auto">
                  <img
                    src="/images/resume-scan.gif"
                    alt="resume-scan"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                </div>
              </>
            ) : (
              <h2 className="text-base sm:text-lg md:text-xl text-gray-400">
                Drop your resume for ATS score and improvement tips
              </h2>
            )}
          </div>

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:gap-6 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" id="company-name" />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" id="job-title" />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" id="job-description" />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
