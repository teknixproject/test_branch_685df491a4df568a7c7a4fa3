import React from 'react'
import PreviewOne.tsx from './PreviewOne.tsx'
import LogOutSSO from './LogOutSSO'
import LoginSSO from './LoginSSO'

const CustomComponent = ({ componentName }: { componentName: string }) => {
    const components: any = {'LoginSSO': LoginSSO,
        'LogOutSSO': LogOutSSO,,
    'PreviewOne.tsx': PreviewOne.tsx
}

    const Component = components[componentName as keyof typeof components]

    if (!Component) {
        return null
    }

    return <Component />
}

export default CustomComponent