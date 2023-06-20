import './App.css';
import "./ode-bootstrap-neo.css";
import { Button, Input, FormControl, Card } from "@ode-react-ui/components";
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

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
      setInterval(() => {
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
              var rootProducts = createRoot(document.getElementById("Results-Products"));
              var Products = [];
              for (let p = 0; p < data.data.products.length; p++) {
                Products.push(
                  <Card
                  app={{
                    address: '',
                    display: false,
                    displayName: '',
                    icon: data.data.products[p].image,
                    isExternal: false,
                    name: 'Product',
                    scope: []
                  }}
                  creatorName={`${data.data.products[p].brand} | ${data.data.products[p].category}`}
                  name={data.data.products[p].name}
                  onOpen={function ro(){}}
                  onSelect={function ro(){}}
                  updatedAt={data.data.products[p].price + "€"}
                  userSrc="&quot;&quot;"
                />
                )
              }
              rootProducts.render(Products)
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
