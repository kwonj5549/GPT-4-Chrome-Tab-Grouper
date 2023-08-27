import type { CSSProperties, ReactElement } from "react"

import { useStorage } from "@plasmohq/storage/hook"


import AutoSaveInput from "~components/autoSaveInput"
import {
  type ProviderConfigs,
  ProviderType,
  defaultProviderConfigs
} from "~storage/config"

interface ImageProps {
  src: string
  alt: string
  width?: string
  isCenter?: boolean
}

const center: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%"
}

function Image({
  src,
  alt,
  width = "100px",
  isCenter = true
}: ImageProps): ReactElement {
  return (
    <div style={isCenter ? center : undefined}>
      <img src={src} width={width} alt={alt} />
    </div>
  )
}

function IndexPage(): ReactElement {
  const [config, setConfig] = useStorage<ProviderConfigs>(
    "providerConfigs",
    defaultProviderConfigs
  )

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 15rem",
        padding: 16,
        fontSize: 16
      }}>
   
      <h1>👋 | Welcome to Tab Grouping</h1>
      <p>Type your OpenAI API key here! </p>
      <AutoSaveInput
        style={{
          justifyContent: "left"
        }}
        value={config?.configs[ProviderType.OpenAI]?.token ?? ""}
        onChange={(token) => {
          void setConfig({
            ...config,
            configs: {
              ...config.configs,
              openai: {
                ...config.configs.openai,
                token
              }
            }
          })
        }}
      />

    
    </div>
  )
}

export default IndexPage
