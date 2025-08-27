import React from 'react'
import LoginSSO from './LoginSSO'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {
    'LoginSSO': LoginSSO
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent