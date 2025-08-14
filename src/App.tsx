import { useState } from "react";

enum ProdogMood {
  Happy = "Happy",
  Sad = "Sad",
  Calm = "Calm",
}

interface SpeechBubbleProps {
  speech: string;
  mood: ProdogMood;
}

function App() {
  const [files, setFiles] = useState<Array<File>>(new Array<File>());
  const [speech, setSpeech] = useState<string>(
    "I am Prodog, your PDF Concatenating Hero. Drop some PDFs in my bowl and I will concatenate them!",
  );
  const [concatenateDisabled, setConcatenateDisabled] = useState<boolean>(true);
  const [mood, setMood] = useState<ProdogMood>(ProdogMood.Calm);

  function SpeechBubble(props: SpeechBubbleProps) {
    const SpeechTypeColor: { [idx: string]: React.CSSProperties } = {
      [ProdogMood.Calm]: { backgroundColor: "white", fontWeight: "bold" },
      [ProdogMood.Happy]: {
        backgroundColor: "rgb(125 192 121)",
        fontWeight: "bolder",
      },
      [ProdogMood.Sad]: { backgroundColor: "#ffee8c", fontWeight: "bolder" },
    };

    return (
      <div className="speechoutline">
        <div className="speechbubblec">
          <div
            className="speechbubble"
            style={SpeechTypeColor[props.mood]}
            dangerouslySetInnerHTML={{ __html: props.speech }}
          >
          </div>
          <div className="triangle" style={SpeechTypeColor[props.mood]}></div>
        </div>
        <div className="speechbubblealignment"></div>
      </div>
    );
  }

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
        ];
        setFiles(newFileList);
        setMood(ProdogMood.Calm);
        setSpeech(
          "You have fed me " + newFileList.map((v) => v.name).join(", ") +
            ". When you are done feeding me, click Concatenate and I will go to work!",
        );
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

    setFiles([]);
    setConcatenateDisabled(true);

    try {
      console.log(`Starting to concatenate: ${form}!`);
      const result = await fetch(url, {
        method: "POST",
        body: form,
      });

      setMood(ProdogMood.Happy);
      setSpeech(
        `I'm all done!! Enjoy your file! If you want me to do more work, feed me again.`,
      );

      console.log(`Success concatenating: ${result}!`);
      const objectUrl = URL.createObjectURL(await result.blob());
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "concatenated.pdf";
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setMood(ProdogMood.Happy);
      setSpeech(
        `I tried to upload your files to concatenate them, but failed: ${e}`,
      );
      console.log(`Could not upload: ${e}!`);
    }
    for (const file of files!) {
      console.log(`${file.name}`);
    }
  };

  return (
    <div className="container">
      <div className="prodog">
        <SpeechBubble speech={speech} mood={mood} />
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
      <button
        id="upload"
        type="button"
        onClick={handleUpload}
        disabled={concatenateDisabled}
      >
        Concatenate!
      </button>
    </div>
  );
}

export default App;
