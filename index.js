(function() {
  "use strict";

  angular.module("angularPdfmake", []).
    controller("pdfCtrl", ["$scope", function($scope) {
      var pdfworker = new Worker("worker.js");

      pdfworker.onmessage = function(evt) {
        switch(evt.data.action) {
          case "donePdf":
            // open("data:application/pdf;base64," + evt.data.base64); // Popup PDF
            saveAs(base64ToBlob(evt.data.base64, "application/pdf"), evt.data.name);
            break;
          default:
            console.log(evt);
        }
      };
      pdfworker.onerror = function(err) {
        console.log(err);
      };

      var base64ToBlob = function(base64, type) {
        var bytes  = atob(base64);
        var buffer = new ArrayBuffer(bytes.length);
        var view   = new Uint8Array(buffer);
        for (var i = 0; i < bytes.length; i++) {
          view[i] = bytes.charCodeAt(i) & 0xff;
        }
        return new Blob([buffer], {type: type});
      };

      $scope.add = function() {
        pdf("init");
        pdf("add", {text:"Hello WebWorker", style:"h1"});
        pdf("add", {
          ol:[
            "First",
            "Second",
            "Third",
            "The last one"
          ]
        });
        pdf("createTable", {
          table: {
            body: [
              [{text:"col 1", style:"th"}, {text:"col 2", style:"th"}, {text:"col 3", style:"th"}],
              ["4", "5.6", "7.89"],
              ["10", "12.345", "678.90123"]
            ]
          },
          headerRows: 1
        });
        pdf("appendTable", [
          "999",
          "123.4",
          "567.8"
        ]);
        pdf("closeTable");
        pdf("add", [{
            text: "Bold Value",
            bold: true
          },
          "normal value"
        ]);
        pdf("add", {
          text: "This paragraph will have a bigger font",
          fontSize: 20
        });
        pdf("styles", {
          h1: {
            bold: true,
            fontSize: 16,
            alignment: "center"
          },
          th: {
            bold: true,
            fontSize:12,
            color:"blue"
          }
        });
        pdf("genPdf", "add-data-to-pdf.pdf");
      };

      $scope.set = function() {
        pdf("init");
        pdf("set", {
          pageOrientation: "landscape",
          footer: {
           text: "copyright 2016",
            fontSize: 15,
           alignment:"center"
          },
          header: {
           text: "my header...",
            fontSize: 20,
           alignment: "right"
          },
          content:{
           table: {
              headerRows: 1,
             body: [
               ["col1", "col2", "col3"],
                ["1","2","3"],
               ["4","5","6"]
              ]
           }
          }
        });
        pdf("genPdf", "set-data-to-pdf.pdf");
      };

      var pdf = function (action, data) {
        pdfworker.postMessage({
          action: action,
          data: data
        });
      };

    }]);

})();

