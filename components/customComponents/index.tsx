import React from 'react'
import PreviewTwo from './PreviewTwo'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {
    'PreviewTwo': PreviewTwo
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent