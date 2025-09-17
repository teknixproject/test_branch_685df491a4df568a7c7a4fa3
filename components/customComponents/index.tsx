import React from 'react'
import PreviewTwo2 from './PreviewTwo2'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {
    'PreviewTwo2': PreviewTwo2
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent