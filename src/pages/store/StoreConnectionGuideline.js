import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
export const StoreConnectionGuideline = () => {
  const baseURL = process.env.REACT_APP_FE_URL;
  const { userId } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const scriptCode = `<script>
  var receivedData = [];
  var total;

  function handleMessage(event) {
    console.log(event.data, "coming from widget");
    const donationData = event.data.donationDetails;
    const totalAmount = event.data.totalAmount;

    receivedData = donationData;
    total = totalAmount;
  }

  function handleIframeLoad() {
    const iframe = document.getElementById("myIframe");
    const message = { type: "INITIALIZE" };
    iframe.contentWindow.postMessage(message, "*");
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("message", handleMessage);

    var iframe = document.getElementById("myIframe");
    iframe.addEventListener("load", handleIframeLoad);

    document
      .getElementById("sendDataToWidget")
      .addEventListener("click", () => {
        const dataToSend = {
          message: {
            orderID: "12345",
            customerID: "12343212",
            storeId: "store id",
            storeName: "name of the store",
            totalDonaltion: total,
            date: "here the date",
            foundations: {
              totalAmount: total,
              donationDetails: receivedData,
            },
          },
        };

        iframe.contentWindow.postMessage(dataToSend, "*");
      });
  });
</script>`;
  const StoreWidgetUrl = `${baseURL}store/widgets/${userId}`;
  const iframeCode = `<iframe
  src="${baseURL}store/widgets/${userId}"
  style="
        position: fixed;
        width: 30%;
        height: 500px;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: none;
        border: none;
      "
      title="Widget IFrame"
      id="myIframe"
></iframe>`;

  const copyIframeToClickBord = () => {
    navigator.clipboard.writeText(`<iframe
    src=${baseURL}store/widgets/${userId}
    style="
      position: fixed;
      width: 30%;
      height: 500px;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      background: none;
      border: none;
    "
    title="Widget IFrame"
    id="myIframe"
  ></iframe>`);
    toast.success("iframe Added to clipboard Successfully", {
      style: {
        width: "450px",
        background: "#198754",
        color: "white",
      },
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const copyScriptToClickBord = () => {
    navigator.clipboard.writeText(`<script>
    var receivedData = [];
    var total;

    function handleMessage(event) {
      console.log(event.data, "coming from widget");
      const donationData = event.data.donationDetails;
      const totalAmount = event.data.totalAmount;

      receivedData = donationData;
      total = totalAmount;
    }

    function handleIframeLoad() {
      const iframe = document.getElementById("myIframe");
      const message = { type: "INITIALIZE" };
      iframe.contentWindow.postMessage(message, "*");
    }

    document.addEventListener("DOMContentLoaded", function () {
      window.addEventListener("message", handleMessage);

      var iframe = document.getElementById("myIframe");
      iframe.addEventListener("load", handleIframeLoad);

      document
        .getElementById("sendDataToWidget")
        .addEventListener("click", () => {
          const dataToSend = {
            message: {
              orderID: "12345",
              customerID: "12343212",
              storeId: "id of the store",
              storeName: "name of the store",
              totalDonaltion: total,
              date: "here the date",
              foundations: {
                totalAmount: total,
                donationDetails: receivedData,
              },
            },
          };

          iframe.contentWindow.postMessage(dataToSend, "*");
        });
    });
  </script>`);
    toast.success("Script Added to clipboard Successfully", {
      style: {
        width: "450px",
        background: "#198754",
        color: "white",
      },
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  return (
    <div className="guideline-page">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "tab1" ? "active" : ""}`}
            onClick={() => handleTabClick("tab1")}
          >
            Shopify
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => handleTabClick("tab2")}
          >
            SFCC
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div
          className={`tab-pane ${activeTab === "tab1" ? "active" : "hidden"}`}
        >
          <h2>Shopify</h2>
          <p>Here is Shopity content.</p>
        </div>
        <div
          className={`tab-pane ${activeTab === "tab2" ? "active" : "hidden"}`}
        >
          <div className="tab-des">
            <h3>
              Please follow these steps to configure widget with your store
            </h3>
            <ul>
              <li>
                <h3>IFrame Content</h3>
                <div className="content">
                <p>
                Click on this below button , and iframe will be saved on the
                clipboard and paste it into your client side file
                </p>
                <p>
                  After clicking the button , the iframe will be save like this
                  format.
                  <br />
                  <br />
                  <pre>
                    <b>{iframeCode}</b>
                    <button className="clip-btn" onClick={copyIframeToClickBord}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </pre>
                  <br />
                  <br />
                </p>
                <p style={{overflow:'auto'}}>
                Embedding the provided {`<iframe>`} element in your client-side
                code will enable the display of a widget on your web page. This
                widget will be positioned in a fixed manner at the bottom right
                corner of the screen, ensuring its persistent visibility to
                users. It has specific dimensions, measuring 30% of the
                viewport's width and 500 pixels in height.
                <br></br>
                <br></br>
                The widget's content will be loaded from the source specified in
                the src attribute, which in this case is set to &nbsp;&nbsp;
                <b>{StoreWidgetUrl}</b>&nbsp;&nbsp; This content is associated
                with your store and may include relevant information or
                functionalities related to your business or products. <br></br>
                <br></br>
                To ensure the widget's proper appearance and functionality,
                various styling attributes have been defined, such as its
                background and border settings. It is given a high z-index value
                (9999) to ensure it overlays other page content, and it will
                have no visible background or border.
                <br></br>
                <br></br>
                <b>Note:</b>You can customize widget appearance according to
                your requirements.
                <br></br>
                <br></br>
                Furthermore, the title attribute has been set as "Widget IFrame"
                for accessibility and identification purposes. The id attribute
                is assigned the value "myIframe," allowing for easy reference
                and manipulation of the iframe element within your JavaScript
                code.
                <br></br>
                <br></br>
                In summary, adding this &nbsp;&nbsp; <b>{"<iframe>"}</b>{" "}
                &nbsp;&nbsp; element to your client-side code will integrate a
                professionally designed widget into your web page, enhancing the
                user experience and providing relevant content or tools
                associated with your store.
                </p>
                </div>
              </li>
             
            <li>
              <h3>Script Content</h3>
              <div className="script-content">
              <p>
                Then Add the script in your client side file. Please click on
                the below button , in this way script code will be added in your
                clipboard
              </p>
              <p>
                After clicking the button , the Script will be save like this
                format.
                <br />
                <br />
                <pre>
                  <b>{scriptCode}</b>
                  <button className="clip-btn" onClick={copyScriptToClickBord}>
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </pre>
                <br />
                <br />
              </p>
              <p>
                The provided JavaScript code is responsible for handling
                communication between your web page and the embedded
                <b>{"<iframe>"}</b> element (referred to as "widget" in the code
                comments). This code allows data to be sent to and received from
                the widget seamlessly. Let's break down the key parts of this
                code and explain their functionality:
                <br></br>
                <br></br>
                <h5>Variables Declaration:</h5>
                <b>receivedData:</b>&nbsp;&nbsp;is an array that will store data
                received from the widget.<br></br>
                <b>total:</b>&nbsp;&nbsp;is a variable to store the total
                donation amount.
                <br></br>
                <br></br>
                <h5>handleMessage Function:</h5>
                This function is executed when a message is received from the
                embedded iframe. It extracts two pieces of information from the
                received message:&nbsp;<b>donationData </b>&nbsp;
                <b>totalAmount</b>.<br></br>
                It updates the <b>receivedData</b> and <b>total</b> variables
                with the received data.
                <h5>handleIframeLoad Function:</h5>
                This function is executed when the&nbsp;<b>{"<iframe>"} </b>
                &nbsp; element with the id "myIframe" has finished loading.
                <br></br>
                It sends an initial <b>INITIALIZE</b> message to the &nbsp;
                <b>iframe</b> using &nbsp;
                <b>postMessage</b>. This message can be used by the widget to
                initialize its state or perform any necessary setup.
                <br></br>
                <br></br>
                <h5>DOMContentLoaded EventListener:</h5>
                This event listener ensures that the following code is executed
                only after the HTML document has been fully loaded.
                <br></br>
                <br></br>
                <h5>message EventListener:</h5>
                This event listener is set up to listen for messages sent from
                the iframe.<br></br>
                When a message is received, it invokes the &nbsp;
                <b>handleMessage</b>&nbsp; function to process the data.
                <br></br>
                <br></br>
                <h5>sendDataToWidget EventListener:</h5>
                This event listener is attached to an HTML element with the id
                "sendDataToWidget" (likely a button).<br></br>
                <br></br>
                When this button is clicked, it creates a &nbsp;
                <b>dataToSend</b>&nbsp; object containing various details such
                as order ID, customer ID, store information, total donation,
                date, and foundations' details.
                <br></br>
                It then uses <b>postMessage</b>&nbsp; to send this data to the
                iframe, allowing the widget to receive and potentially process
                this information.
                <br></br>
                <br></br>
                In summary, this JavaScript code sets up a communication
                mechanism between your web page and an embedded widget through
                the use of &nbsp;<b>postMessage</b>&nbsp;. It allows your web
                page to send data to the widget and receive data from it,
                facilitating dynamic interactions and data sharing between the
                two components. This is commonly used for integrating
                third-party widgets or components into a web page while
                maintaining control and communication with them.
              </p>
              </div>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
