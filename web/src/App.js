import './App.css';
import "./ode-bootstrap-neo.css";
import { Button, Input, FormControl, Card, EmptyScreen } from "@ode-react-ui/components";
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
              method: "GET",
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

    var emptyScreen = <EmptyScreen
      imageSrc="/illu-notfound.svg"
      text="No ressource have been found. Start a search or change your search terms !"
      title="There is nothing here…"
    />

    useEffect(async () => {

      async function getProductsData(req, page) {
        document.getElementById("Results-Products").style.opacity = "0.5";
        document.getElementById("Results-Products").style.overflowY = "hidden";
        document.getElementById("Results-Products").style.cursor = "wait";


        var res = await fetch(localStorage.getItem("localtunnel") + "/search/?q=" + req + "&page=" + page, {
          method: "GET",
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        })

        if (res.status === 200) {
          var res = await res.json()
          if (productPage == 1) {
            document.getElementById("ProductsTag").innerText = `Products (${res.data.total.products})`
          }
          productPage++;
          return res;
        }
      }

      var productPage = 1;
      var products = [];
      var productMax = false

      async function getBrandsData(req, page) {
        document.getElementById("Results-Brands").style.opacity = "0.5";
        document.getElementById("Results-Brands").style.overflowY = "hidden";
        document.getElementById("Results-Brands").style.cursor = "wait";

        var res = await fetch(localStorage.getItem("localtunnel") + "/search/?q=" + req + "&page=" + page, {
          method: "GET",
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        })

        if (res.status === 200) {
          var res = await res.json()
          if (brandPage == 1) {
            document.getElementById("BrandsTag").innerText = `Brands (${res.data.total.brands})`
          }
          brandPage++;
          return res;
        }
      }

      var brandPage = 1;
      var brands = [];
      var brandMax = false;

      async function getCategoriesData(req, page) {
        document.getElementById("Results-Categories").style.opacity = "0.5";
        document.getElementById("Results-Categories").style.overflowY = "hidden";
        document.getElementById("Results-Categories").style.cursor = "wait";

        var res = await fetch(localStorage.getItem("localtunnel") + "/search/?q=" + req + "&page=" + page, {
          method: "GET",
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        })

        if (res.status === 200) {
          var res = await res.json()
          if (categoryPage == 1) {
            document.getElementById("CategoriesTag").innerText = `Categories (${res.data.total.categories})`
          }
          categoryPage++;
          return res;
        }
      }

      var categoryPage = 1;
      var categories = [];
      var categoryMax = false;

      document.getElementById("search").addEventListener("keyup", async (e) => {
        clearTimeout(window.searchTimeout);

        window.searchTimeout = setTimeout(async () => {
          productMax = false;
          products = [];
          productPage = 1;

          brandMax = false;
          brands = [];
          brandPage = 1;

          categoryMax = false;
          categories = [];
          categoryPage = 1;

          var query = document.getElementById("search").value;

          if (query.length > 0) {
            var productData = await getProductsData(query, productPage);
            productData = productData.data;

            var brandData = await getBrandsData(query, brandPage);
            brandData = brandData.data;

            var categoryData = await getCategoriesData(query, categoryPage);
            categoryData = categoryData.data;

            if (productData.products.length > 0) {
              productData.products.forEach((product) => {
                products.push(
                  <Card
                    app={{
                      address: "",
                      display: false,
                      displayName: "",
                      icon: product.image,
                      isExternal: false,
                      name: null,
                      scope: [],
                    }}
                    creatorName={`${product.brand} | ${product.category}`}
                    name={product.name}
                    onOpen={function ro() { }}
                    onSelect={function ro() { }}
                    updatedAt={product.price + "€"}
                    userSrc="https://i.pravatar.cc/300"
                  />
                );
              });
              createRoot(document.getElementById("Results-Products")).render(products);
              document.getElementById("Results-Products").style.opacity = "1";
              document.getElementById("Results-Products").style.overflowY = "scroll";
              document.getElementById("Results-Products").style.cursor = "default";
            } else {
              createRoot(document.getElementById("Results-Products")).render(emptyScreen);
              document.getElementById("Results-Products").style.opacity = "1";
              document.getElementById("Results-Products").style.overflowY = "scroll";
              document.getElementById("Results-Products").style.cursor = "default";
            }
            document.getElementById('Results-Products').addEventListener('scroll', async function () {
              if (document.getElementById('Results-Products').scrollTop + document.getElementById('Results-Products').clientHeight >= document.getElementById('Results-Products').scrollHeight) {
                if (!productMax) {
                  productData = await getProductsData(query, productPage, productMax);
                  productData = productData.data;
                  if (productData.products.length > 0) {
                    productData.products.forEach((product) => {
                      products.push(
                        <Card
                          app={{
                            address: "",
                            display: false,
                            displayName: "",
                            icon: product.image,
                            isExternal: false,
                            name: null,
                            scope: [],
                          }}
                          creatorName={`${product.brand} | ${product.category}`}
                          name={product.name}
                          onOpen={function ro() { }}
                          onSelect={function ro() { }}
                          updatedAt={product.price + "€"}
                          userSrc="https://i.pravatar.cc/300"
                        />
                      );
                    });
                    createRoot(document.getElementById("Results-Products")).render(products);
                    document.getElementById("Results-Products").style.opacity = "1";
                    document.getElementById("Results-Products").style.overflowY = "scroll";
                    document.getElementById("Results-Products").style.cursor = "default";
                  } else {
                    document.getElementById("Results-Products").style.opacity = "1";
                    document.getElementById("Results-Products").style.overflowY = "scroll";
                    document.getElementById("Results-Products").style.cursor = "default";

                    productMax = true;
                  }
                }
              }
            });

            if (brandData.brands.length > 0) {
              brandData.brands.forEach((brand) => {
                brands.push(
                  <Card
                    app={{
                      address: "",
                      display: false,
                      displayName: "",
                      icon: brand.image,
                      isExternal: false,
                      name: null,
                      scope: [],
                    }}
                    creatorName={`${brand.brand} | ${brand.category}`}
                    name={brand.name}
                    onOpen={function ro() { }}
                    onSelect={function ro() { }}
                    updatedAt={brand.price + "€"}
                    userSrc="https://i.pravatar.cc/300"
                  />
                );
              });
              createRoot(document.getElementById("Results-Brands")).render(brands);
              document.getElementById("Results-Brands").style.opacity = "1";
              document.getElementById("Results-Brands").style.overflowY = "scroll";
              document.getElementById("Results-Brands").style.cursor = "default";
            } else {
              createRoot(document.getElementById("Results-Brands")).render(emptyScreen);
              document.getElementById("Results-Brands").style.opacity = "1";
              document.getElementById("Results-Brands").style.overflowY = "scroll";
              document.getElementById("Results-Brands").style.cursor = "default";
            }
            document.getElementById('Results-Brands').addEventListener('scroll', async function () {
              if (document.getElementById('Results-Brands').scrollTop + document.getElementById('Results-Brands').clientHeight >= document.getElementById('Results-Brands').scrollHeight) {
                if (!brandMax) {
                  brandData = await getBrandsData(query, brandPage, brandMax);
                  brandData = brandData.data;
                  if (brandData.brands.length > 0) {
                    brandData.brands.forEach((brand) => {
                      brands.push(
                        <Card
                          app={{
                            address: "",
                            display: false,
                            displayName: "",
                            icon: brand.image,
                            isExternal: false,
                            name: null,
                            scope: [],
                          }}
                          creatorName={`${brand.brand} | ${brand.category}`}
                          name={brand.name}
                          onOpen={function ro() { }}
                          onSelect={function ro() { }}
                          updatedAt={brand.price + "€"}
                          userSrc="https://i.pravatar.cc/300"
                        />
                      );
                    });
                    createRoot(document.getElementById("Results-Brands")).render(brands);
                    document.getElementById("Results-Brands").style.opacity = "1";
                    document.getElementById("Results-Brands").style.overflowY = "scroll";
                    document.getElementById("Results-Brands").style.cursor = "default";
                  } else {
                    document.getElementById("Results-Brands").style.opacity = "1";
                    document.getElementById("Results-Brands").style.overflowY = "scroll";
                    document.getElementById("Results-Brands").style.cursor = "default";

                    brandMax = true;
                  }
                }
              }
            });

            if (categoryData.categories.length > 0) {
              categoryData.categories.forEach((category) => {
                categories.push(
                  <Card
                    app={{
                      address: "",
                      display: false,
                      displayName: "",
                      icon: category.image,
                      isExternal: false,
                      name: null,
                      scope: [],
                    }}
                    creatorName={`${category.brand} | ${category.category}`}
                    name={category.name}
                    onOpen={function ro() { }}
                    onSelect={function ro() { }}
                    updatedAt={category.price + "€"}
                    userSrc="https://i.pravatar.cc/300"
                  />
                );
              });
              createRoot(document.getElementById("Results-Categories")).render(categories);
              document.getElementById("Results-Categories").style.opacity = "1";
              document.getElementById("Results-Categories").style.overflowY = "scroll";
              document.getElementById("Results-Categories").style.cursor = "default";
            } else {
              createRoot(document.getElementById("Results-Categories")).render(emptyScreen);
              document.getElementById("Results-Categories").style.opacity = "1";
              document.getElementById("Results-Categories").style.overflowY = "scroll";
              document.getElementById("Results-Categories").style.cursor = "default";
            }

            document.getElementById('Results-Categories').addEventListener('scroll', async function () {
              if (document.getElementById('Results-Categories').scrollTop + document.getElementById('Results-Categories').clientHeight >= document.getElementById('Results-Categories').scrollHeight) {
                if (!categoryMax) {
                  categoryData = await getCategoriesData(query, categoryPage, categoryMax);
                  categoryData = categoryData.data;
                  if (categoryData.categories.length > 0) {
                    categoryData.categories.forEach((category) => {
                      categories.push(
                        <Card
                          app={{
                            address: "",
                            display: false,
                            displayName: "",
                            icon: category.image,
                            isExternal: false,
                            name: null,
                            scope: [],
                          }}
                          creatorName={`${category.brand} | ${category.category}`}
                          name={category.name}
                          onOpen={function ro() { }}
                          onSelect={function ro() { }}
                          updatedAt={category.price + "€"}
                          userSrc="https://i.pravatar.cc/300"
                        />
                      );
                    });
                    createRoot(document.getElementById("Results-Categories")).render(categories);
                    document.getElementById("Results-Categories").style.opacity = "1";
                    document.getElementById("Results-Categories").style.overflowY = "scroll";
                    document.getElementById("Results-Categories").style.cursor = "default";
                  } else {
                    document.getElementById("Results-Categories").style.opacity = "1";
                    document.getElementById("Results-Categories").style.overflowY = "scroll";
                    document.getElementById("Results-Categories").style.cursor = "default";

                    categoryMax = true;
                  }
                }
              }
            });
          } else {
            createRoot(document.getElementById("Results-Products")).render(emptyScreen);
            createRoot(document.getElementById("Results-Brands")).render(emptyScreen);
            createRoot(document.getElementById("Results-Categories")).render(emptyScreen);

            document.getElementById("ProductsTag").innerText = "Products";
            document.getElementById("BrandsTag").innerText = "Brands";
            document.getElementById("CategoriesTag").innerText = "Categories";
            
          }

        }, 1000);
      });

    }, [])

    return (
      <div className="App">
        <FormControl className="App-SearchForm">
          <Input
            placeholder="Search for a product, brand or category..."
            size="md"
            type="text"
            id="search"
            autoComplete='off'
          />
        </FormControl>
        <div className="Results">
          <h3 id="ProductsTag">Products</h3>
          <div id="Results-Products">
            {emptyScreen}
          </div>
          <h3 id="BrandsTag">Brands</h3>
          <div id="Results-Brands">
            {emptyScreen}
          </div>
          <h3 id="CategoriesTag">Categories</h3>
          <div id="Results-Categories">
            {emptyScreen}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
