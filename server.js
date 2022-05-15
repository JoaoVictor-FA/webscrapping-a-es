const puppeteer = require("puppeteer");

async function main() {
  document.querySelector("#status").innerHTML = "carregando...";
  const cotação = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://fundamentei.com/");
  await page.click(
    "body > div.adopt-card.adopt-bar-left.svelte-1iwk8xn > div > div.adopt-buttons-container.svelte-1iwk8xn > button.accept-all-button.svelte-1iwk8xn"
  );
  await page.click(".css-7dlv7o");
  await page.type(".css-zbgoky", "daride4552@biohorta.com");
  await page.type("[placeholder=Senha]", "123456789");
  await page.click(".css-1dqkbbj");
  await page.waitForSelector(".css-1kidu9e", { visible: true });
  ticker = document.querySelector("#ticker").value;
  if (ticker == "") {
    return "escreva um ticker";
  }
  await page.goto(`https://fundamentei.com/br/` + ticker, {
    waitUntil: "load",
    timeout: 0,
  });
  try {
    await page.waitForSelector(".vx-bar", { visible: true, timeout: 100 });
  } catch (e) {
    console.log("oi");
    return "Erro";
  }
  await page.hover(".vx-bar");
  let mexer = 0;
  await page.mouse.move(mexer, page.mouse._y);
  let varredura = true;
  let terminou = false;
  while (varredura) {
    mexer += 1;
    await page.mouse.move(mexer, page.mouse._y);
    const resultado = await page.evaluate(() => {
      if (document.querySelector(".css-1nlah7v") != null) {
        return {
          valor: document.querySelector(".css-1nlah7v").innerHTML,
          data: document.querySelector(".css-1aq3xfa").innerHTML,
        };
      } else return undefined;
    });
    if (resultado != undefined) {
      cotação.push(resultado);
      terminou = true;
    }
    if (terminou && resultado == undefined) {
      varredura = false;
    }
  }

  for (let i = 0; i < cotação.length; i++) {
    if (cotação[i - 1] != undefined && cotação[i - 2] != undefined) {
      if (cotação[i - 1].data == cotação[i - 2].data) {
        cotação.splice(i - 1, 1);
        i--;
      }
    }
  }

  await browser.close();
  return cotação;
}

function pegaDados() {
  main().then((res) => {
    if (res == "escreva um ticker") {
      document.querySelector("#status").innerHTML = "Escreva um ticker";
      return;
    }
    if (res == "Erro") {
      document.querySelector("#status").innerHTML =
        "Deu erro, Confira a url: https://fundamentei.com/br/" +
        document.querySelector("#ticker").value;
      return;
    }
    document.querySelector("#status").innerHTML = "Baixou";
    respostaV = "";
    respostaD = "";
    for (let i = 0; i < res.length; i++) {
      respostaV += res[i].valor + ";";
      respostaD += res[i].data + ";";
    }
    document.querySelector("#valor").value = respostaV;
    document.querySelector("#data").value = respostaD;
  });
}
