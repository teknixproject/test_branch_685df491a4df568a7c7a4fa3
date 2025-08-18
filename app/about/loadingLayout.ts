export const loadingLayout = {
  "_id": "689efc55adf407e596c9ed7e",
  "projectId": "prj_o2mspgebvAvrdtVAr8SnVfJ0LzJB",
  "type": "Local",
  "name": "Loading Home",
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
          "_id": "686268a8fb00afb32477839b",
          "value": "Radio",
          "name": "Radio",
          "type": "DataEntry",
          "createdAt": "2025-06-30T10:36:24.718Z",
          "updatedAt": "2025-06-30T10:36:24.718Z",
          "__v": 0,
          "id": "Radio$2f9f8ade-592e-447e-a1c3-ee2c88521bca",
          "childs": [],
          "thumbnail": "",
          "componentProps": {
            "dataProps": [
              {
                "name": "options",
                "type": "data"
              },
              {
                "name": "value",
                "type": "data"
              },
              {
                "name": "defaultValue",
                "type": "data"
              },
              {
                "name": "onChange",
                "type": "MouseEventHandler"
              }
            ],
            "options": {
              "valueInput": [
                {
                  "label": "Apple",
                  "value": "Apple"
                },
                {
                  "label": "Pear",
                  "value": "Pear"
                },
                {
                  "label": "Orange",
                  "value": "Orange"
                }
              ],
              "type": "valueInput"
            },
            "size": {
              "valueInput": "middle",
              "type": "valueInput"
            },
            "optionType": {
              "valueInput": "default",
              "type": "valueInput"
            },
            "block": {
              "valueInput": false,
              "type": "valueInput"
            },
            "disabled": {
              "valueInput": false,
              "type": "valueInput"
            },
            "buttonStyle": {
              "valueInput": "outline",
              "type": "valueInput"
            }
          }
        },
        {
          "_id": "685cb64ab24a6b0da3f2b743",
          "value": "Flex",
          "name": "Flex",
          "type": "Layout",
          "createdAt": "2025-06-26T02:54:02.761Z",
          "updatedAt": "2025-06-26T02:54:02.761Z",
          "__v": 0,
          "id": "Flex$62461dc8-b019-4ede-981f-420b5c706370",
          "childs": [],
          "thumbnail": "",
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
                "paddingBottom": "5px"
              }
            }
          }
        },
        {
          "_id": "684942a5ea3ce52c55586d23",
          "value": "Table",
          "name": "Table",
          "type": "DataDisplay",
          "createdAt": "2025-06-05T10:06:01.869Z",
          "updatedAt": "2025-06-05T10:06:01.869Z",
          "__v": 0,
          "id": "Table$6b58511a-b444-486f-ace1-f7f4da1883d7",
          "childs": [],
          "thumbnail": "",
          "componentProps": {
            "size": "middle",
            "tableLayout": "auto",
            "bordered": false,
            "loading": false,
            "pagination": false,
            "pagination-current": 1,
            "pagination-total": 10,
            "pagination-limit": 1000,
            "pagination-pageSizeOptions": [
              10,
              20,
              50,
              100
            ],
            "pagination-pageSize": 100,
            "dataSource": [
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
            "columns": [
              {
                "title": "Name",
                "dataIndex": "name",
                "key": "name",
                "box": {
                  "id": "Flex$af4561d0-e44b-4439-a761-b40715782fd3",
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
                  "id": "Flex$2f340935-6e46-4391-a691-67ee36b07a74",
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
                  "id": "Flex$de4046ba-bc7a-4336-914a-ba835c84c209",
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
            "width": "100%",
            "height": "100%"
          }
        }
      }
    }
  },
  "customWidgetIds": [],
  "branch": "main",
  "createdAt": "2025-08-15T09:22:29.024Z",
  "updatedAt": "2025-08-15T09:22:29.024Z",
  "__v": 0
};
