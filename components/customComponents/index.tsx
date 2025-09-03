import React from 'react'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent