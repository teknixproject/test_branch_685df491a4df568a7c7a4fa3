import React from 'react'
import LoginSSO from './LoginSSO'
import LoginCustom from './LoginCustom'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components = {
        'LoginCustom': LoginCustom
    }

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent