import React from 'react'
import PreviewTwo from './PreviewTwo'
import PreviewOne from './PreviewOne'
import LogOutSSO from './LogOutSSO'
import LoginSSO from './LoginSSO'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {'LoginSSO': LoginSSO,
        'LogOutSSO': LogOutSSO,
        'PreviewOne': PreviewOne,
    'PreviewTwo': PreviewTwo
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent