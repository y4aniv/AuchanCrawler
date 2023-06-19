import './App.css';
import "./ode-bootstrap-neo.css";
import { Button, Input, FormControl } from "@ode-react-ui/components";
import { useEffect } from 'react';

function App() {
  if (localStorage.getItem("localtunnel") === null) {
    return (
      <div className="App">
        <FormControl className="getLocaltunnel">
          <Input
            placeholder="Enter the address displayed in your terminal"
            size="md"
            type="text"
            id="localtunnelURL"
          />
          <Button id="setLocaltunnel" onClick={() => {
            let localtunnel = document.getElementById("localtunnelURL").value;
            if (localtunnel.indexOf("https://") === -1) {
              localtunnel = "https://" + localtunnel;
            }
            if (localtunnel.charAt(localtunnel.length - 1) === "/") {
              localtunnel = localtunnel.slice(0, -1);
            }

            fetch(localtunnel + "/auchancrawler", {
              headers: {
                "Bypass-Tunnel-Reminder": "true"
              }
            }).then((res) => {
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
                  localStorage.setItem("localtunnel", localtunnel);
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
      setInterval(()=>{
        fetch(localStorage.getItem("localtunnel") + "/auchancrawler", {
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            localStorage.removeItem("localtunnel");
            window.location.reload();
          }
        }).then((data) => {
          if (data.message != "auchancrawler") {
            localStorage.removeItem("localtunnel");
            window.location.reload();
          }
        }).catch((err) => {
          localStorage.removeItem("localtunnel");
          window.location.reload();
        })
      }, 1000)

      document.getElementById("search").addEventListener("keyup", (e) => {  
        if (e.target.value != "") {
          fetch(`${localStorage.getItem("localtunnel")}/search?q=${e.target.value}&page=1`, {
            headers: {
              "Bypass-Tunnel-Reminder": "true"
            }
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              document.getElementById("Results-Products").innerHTML = "";
              for (let p = 0; p < data.data.products.length; p++) {
                document.getElementById("Results-Products").innerHTML += `<div class="Product"><img src="${data.data.products[p].image}" /><div class="Product-Info"><div class="Product-Name">${data.data.products[p].name}</div><div class="Product-Brand">${data.data.products[p].brand}</div><div class="Product-Price">${data.data.products[p].price}</div></div></div>`
              }
            })
        }
      })
    })
    return (
      <div className="App">
        <FormControl className="App-SearchForm">
          <Input
            placeholder="Search for a product, brand or category..."
            size="md"
            type="text"
            id="search"
          />
        </FormControl>
        <div className="Results">
          <div id="Results-Products">
          </div>
          <div id="Results-Brands"></div>
          <div id="Results-Categories"></div>
        </div>
      </div>
    );
  }
}

export default App;
