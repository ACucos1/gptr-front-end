/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

const url = "http://localhost:5001";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState([]);
  const [topK, setTopK] = useState([]);

  const evalColor = (idx) => {
    // console.log(inputText.split(" ").length);
    if (topK[idx]) {
      const wordRanking = topK[idx][0];
      if (wordRanking < 10) return "#65b849";
      // else if (wordRanking < 100) return "#e0dd31";
      // return "#eb3b43";
    }

    // return "blue";
  };

  const handleTextAreaChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${url}/api/analyze`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project: "gpt-2-small", text: inputText }),
    });
    const data = await res.json();
    console.log(data);
    setTopK(data.result.real_topk);
    setOutputText(data.result.bpe_strings);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Detect AI Generated text' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <nav className={styles.Navbar}>
        <div className={styles.LogoWrapper}>
          <img src='' alt='Logo' />
          AI Text Recognition
        </div>
      </nav>
      <main className={styles.Main}>
        <div className={styles.FormWrapper}>
          <form className={styles.Form} onSubmit={handleSubmit}>
            <textarea
              name='text'
              cols='30'
              rows='10'
              value={inputText}
              onChange={handleTextAreaChange}
            />
            <input type='submit' />
          </form>
        </div>

        <div className={styles.OutputWrapper}>
          <div className={styles.Output}>
            {topK.length > 0 &&
              outputText.slice(1, outputText.length - 1).map((word, idx) => (
                <span key={idx} style={{ backgroundColor: evalColor(idx) }}>
                  {word.split("Ġ").join(" ").split("Ċ").join("")}
                </span>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
