import { useState } from "react";

function App() {
  const [files, setFiles] = useState<Array<File>>(new Array<File>());
  const [speech, setSpeech] = useState<string>("Drop some PDFs in my bowl and I will concatenate them!");
  const [concatenateDisabled, setConcatenateDisabled] = useState<boolean>(true);

  const handleNewDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(`target.files: ${e.target.files.length}`);
      const newFiles = e.target.files;
      if (newFiles) {
        const newFileList = [
          ...files,
          ...Array.from({ length: newFiles.length }).map((_, v) => {
            return newFiles.item(v)!;
          }),
        ]
        setFiles(newFileList);
        setSpeech("You have fed me " + newFileList.map((v) => v.name).join(", ") + ". When you are done feeding me, click Concatenate and I will go to work!");
        setConcatenateDisabled(false);
      }
    }
  };

  const handleUpload = async () => {
    const url = `https://prodog-server-cf.cerfca.st/concat`;
    console.log("Someone wants to upload.");

    const form = new FormData();

    [...files!].forEach((file) => {
      form.append(file.name, file, file.name);
    });

    try {
      console.log(`Starting to concatenate: ${form}!`);
      const result = await fetch(url, {
        method: "POST",
        body: form,
      });

      console.log(`Success concatenating: ${result}!`);
      const objectUrl = URL.createObjectURL(await result.blob());
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "concatenated.pdf";
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.log(`Could not upload: ${e}!`);
    }
    for (const file of files!) {
      console.log(`${file.name}`);
    }
  };

  return (
    <div>
      <div className="prodog">
        <div className="speechoutline">
          <div className="speechbubblec">
            <div className="speechbubble">I am <i>prodog</i> ... your PDF-concatenating hero! {speech}</div>
            <div className="triangle"></div>
            </div>
          <div className="speechbubblealignment"></div>
        </div>
        <div className="dropspot">
          <input
            id="files"
            multiple
            className="dropinput"
            type="file"
            onChange={handleNewDrop}
          />
        </div>
      </div>
      <button id="upload" type="button" onClick={handleUpload} disabled={concatenateDisabled}>
        Concatenate!
      </button>
    </div>
  );
}

export default App;
