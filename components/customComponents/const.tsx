import React from 'react'
import TestCreateComponent from './TestCreateComponent'

import { components } from "./const"

function convertKeysToLowercase(obj: any) {
    const newObj: any = {}

    Object.keys(obj).forEach(key => {
        newObj[key.toLowerCase()] = obj[key]
    })

    return newObj
}

export const componentCodes = convertKeysToLowercase(components)