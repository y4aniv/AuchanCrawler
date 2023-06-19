import './App.css';
import "./ode-bootstrap-neo.css";
import { Button, Input, FormControl } from "@ode-react-ui/components";
import { useEffect } from 'react';

function App() {
  if (sessionStorage.getItem("NGROK") === null) {
    return (
      <div className="App">
        <FormControl className="getNgrok">
          <Input
            placeholder="Enter the address displayed in your terminal"
            size="md"
            type="text"
            id="ngrokURL"
          />
          <Button id="setNgrok" onClick={() => {
            let ngrok = document.getElementById("ngrokURL").value;
            if (ngrok.indexOf("https://") === -1) {
              ngrok = "https://" + ngrok;
            }
            if (ngrok.charAt(ngrok.length - 1) === "/") {
              ngrok = ngrok.slice(0, -1);
            }

            fetch(ngrok + "/auchancrawler").then((res) => {
              if (res.status === 200) {
                return res.json();
              } else {
                alert("The address provided appears to be incorrect. Please check it and try again.")
              }
            })
              .then((data) => {
                if (data.message != "auchancrawler") {
                  alert("The address provided appears to be incorrect. Please check it and try again.")
                } else {
                  sessionStorage.setItem("NGROK", ngrok);
                  window.location.reload();
                }
              })
              .catch((err) => {
                alert("The address provided appears to be incorrect. Please check it and try again.")
              })
          }}>Launch the application</Button>
        </FormControl>
      </div>
    )
  } else {
    useEffect(() => {
        setInterval(() => {
          fetch(sessionStorage.getItem("NGROK") + "/auchancrawler").then((res) => {
            return res.json();
          }).then((data) => {
            if (data.message != "auchancrawler") {
              sessionStorage.clear();
              window.location.reload();
            }
          }).catch((err) => {
            sessionStorage.clear();
            window.location.reload();
          })
        }, 1000)
    })
    return (
      <div className="App">
        <FormControl className="App-SearchForm">
          <Input
            placeholder="Search for a product, brand or category..."
            size="md"
            type="text"
          />
        </FormControl>
        <div className="Results">
          <div id="Results-Products"></div>
          <div id="Results-Brands"></div>
          <div id="Results-Categories"></div>
        </div>
      </div>
    );
  }
}

export default App;
