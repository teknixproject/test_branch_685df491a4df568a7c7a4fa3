export const loadingLayout = {
  "_id": "68a2981b4fd9abc7070f200e",
  "projectId": "prj_o2mspgebvAvrdtVAr8SnVfJ0LzJB",
  "type": "Local",
  "name": "Loading About",
  "layoutJson": {
    "mobile": {
      "id": "root",
      "type": "flex",
      "value": "flex",
      "style_mobile": {
        "display": "block"
      },
      "style_tablet": {
        "display": "block"
      },
      "style_laptop": {
        "display": "block"
      },
      "style_pc": {
        "display": "block"
      },
      "childs": [],
      "typeScreen": "mobile",
      "breakpoint": "style_laptop"
    },
    "desktop": {
      "id": "root",
      "type": "flex",
      "value": "flex",
      "style": {
        "display": "block"
      },
      "style_mobile": {
        "display": "block"
      },
      "style_tablet": {
        "display": "block"
      },
      "style_laptop": {
        "display": "block"
      },
      "style_pc": {
        "display": "block"
      },
      "childs": [
        {
          "_id": "684942a5ea3ce52c55586d23",
          "value": "Table",
          "name": "Table",
          "type": "DataDisplay",
          "createdAt": "2025-06-05T10:06:01.869Z",
          "updatedAt": "2025-06-05T10:06:01.869Z",
          "__v": 0,
          "id": "Table$8685de39-310d-42ca-8995-00f695ac62b6",
          "childs": [],
          "thumbnail": "",
          "componentProps": {
            "size": {
              "valueInput": "middle",
              "type": "valueInput"
            },
            "tableLayout": {
              "valueInput": "auto",
              "type": "valueInput"
            },
            "bordered": {
              "valueInput": false,
              "type": "valueInput"
            },
            "loading": {
              "valueInput": false,
              "type": "valueInput"
            },
            "pagination": {
              "valueInput": false,
              "type": "valueInput"
            },
            "pagination-current": {
              "valueInput": 1,
              "type": "valueInput"
            },
            "pagination-total": {
              "valueInput": 10,
              "type": "valueInput"
            },
            "pagination-limit": {
              "valueInput": 1000,
              "type": "valueInput"
            },
            "pagination-pageSizeOptions": {
              "valueInput": [
                10,
                20,
                50,
                100
              ],
              "type": "valueInput"
            },
            "pagination-pageSize": {
              "valueInput": 100,
              "type": "valueInput"
            },
            "dataSource": {
              "valueInput": [
                {
                  "key": "1",
                  "name": "Mike",
                  "age": 32,
                  "address": "10 Downing Street"
                },
                {
                  "key": "2",
                  "name": "Mike",
                  "age": 32,
                  "address": "10 Downing Street"
                },
                {
                  "key": "3",
                  "name": "Mike",
                  "age": 32,
                  "address": "10 Downing Street"
                },
                {
                  "key": "4",
                  "name": "Mike",
                  "age": 32,
                  "address": "10 Downing Street"
                }
              ],
              "type": "valueInput"
            },
            "columns": [
              {
                "title": "Name",
                "dataIndex": "name",
                "key": "name",
                "box": {
                  "id": "Flex$504db331-1a5d-4f5b-b7c2-ea04638206e6",
                  "value": "Flex",
                  "name": "Flex",
                  "childs": [],
                  "type": "Layout",
                  "componentProps": {
                    "style": {
                      "display": "flex",
                      "gap": "5px"
                    }
                  }
                }
              },
              {
                "title": "Age",
                "dataIndex": "age",
                "key": "age",
                "box": {
                  "id": "Flex$3c232327-c48d-46b7-98b4-f8d68baafbfe",
                  "value": "Flex",
                  "name": "Flex",
                  "childs": [],
                  "type": "Layout",
                  "componentProps": {
                    "style": {
                      "display": "flex",
                      "gap": "5px"
                    }
                  }
                }
              },
              {
                "title": "Address",
                "dataIndex": "address",
                "key": "address",
                "box": {
                  "id": "Flex$b75612bd-2a16-434f-93ab-47c6e2186536",
                  "value": "Flex",
                  "name": "Flex",
                  "childs": [],
                  "type": "Layout",
                  "componentProps": {
                    "style": {
                      "display": "flex",
                      "gap": "5px"
                    }
                  }
                }
              }
            ],
            "dataProps": [
              {
                "name": "pagination-onChange",
                "label": "Paginationn OnChange",
                "type": "MouseEventHandler",
                "args": [
                  {
                    "name": "page",
                    "index": 0,
                    "type": "number",
                    "isList": false
                  },
                  {
                    "name": "pageSize",
                    "index": 1,
                    "type": "number",
                    "isList": false
                  }
                ]
              },
              {
                "name": "rowSelection.onChange",
                "type": "MouseEventHandler"
              },
              {
                "name": "onRow.onClick",
                "type": "MouseEventHandler"
              },
              {
                "name": "onRow.onDoubleClick",
                "type": "MouseEventHandler"
              },
              {
                "name": "onRow.onMouseEnter",
                "type": "MouseEventHandler"
              },
              {
                "name": "onRow.onMouseLeave",
                "type": "MouseEventHandler"
              }
            ],
            "styleMultiple": {
              "normal": {
                "width": "100%"
              }
            },
            "enableRowSelection": {
              "type": "valueInput"
            },
            "enableFooter": {
              "type": "valueInput"
            },
            "rowSelectionType": {
              "type": "valueInput"
            },
            "rowSelectionFixed": {
              "type": "valueInput"
            },
            "rowSelectionPreserveSelectedRowKeys": {
              "type": "valueInput"
            },
            "footerColumns": []
          }
        }
      ],
      "typeScreen": "pc",
      "breakpoint": "style_pc",
      "componentProps": {
        "dataProps": [
          {
            "name": "onClick",
            "type": "MouseEventHandler"
          }
        ],
        "styleMultiple": {
          "normal": {
            "display": "flex",
            "flexDirection": "row",
            "paddingTop": "5px",
            "paddingLeft": "5px",
            "paddingRight": "5px",
            "paddingBottom": "5px",
            "height": "100%",
            "justifyContent": "center",
            "alignItems": "center"
          }
        }
      }
    }
  },
  "customWidgetIds": [],
  "branch": "main",
  "createdAt": "2025-08-18T03:03:55.319Z",
  "updatedAt": "2025-08-18T03:03:55.320Z",
  "__v": 0
};
