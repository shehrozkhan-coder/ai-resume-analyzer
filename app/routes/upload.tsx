import { prepareInstructions } from "~/constants";
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
      setStatusText("Uploading resume...");

      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile?.path) {
        throw new Error("Resume upload failed");
      }

      setStatusText("Converting PDF to image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile?.file) {
        throw new Error("PDF conversion failed");
      }

      setStatusText("Uploading image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage?.path) {
        throw new Error("Image upload failed");
      }

      setStatusText("Preparing data...");
      const uuid = UUID();

      const data: any = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null, // ✅ fixed (was "")
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing resume...");

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
        })
      );

      if (!feedback?.message?.content) {
        throw new Error("AI analysis failed");
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      // ✅ Safe JSON Extraction (production safe)
      const cleaned = feedbackText.trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}") + 1;

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("AI returned invalid JSON format");
      }

      const safeJson = cleaned.slice(jsonStart, jsonEnd);
      data.feedback = JSON.parse(safeJson);

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete. Redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error("Unexpected Error:", error);
      setStatusText("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
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
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                />
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
