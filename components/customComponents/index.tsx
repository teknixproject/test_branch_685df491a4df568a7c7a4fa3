import React from 'react'
import PreviewOne from './PreviewOne'
import PreviewTwo2 from './PreviewTwo2'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {'PreviewTwo2': PreviewTwo2,
    'PreviewOne': PreviewOne
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent