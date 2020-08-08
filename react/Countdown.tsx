// ts-nocheck
import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'

import { useQuery } from 'react-apollo'
import productReleaseDate from './queries/productReleaseDate.graphql'

// ts-ignore
import useProduct from 'vtex.product-context/useProduct'

interface CountdownProps {
  targetDate: string
}

const DEFAULT_TARGET_DATE = (new Date('2020-08-07')).toISOString()
const CSS_HANDLES = ['countdown']

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)
  
  // @ ts-ignore
  //const { product: { linkText }} = useProduct()

  const productContext = useProduct()
  const product = productContext?.product
  const linkText = product?.linkText

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }

  // @ ts-ignore
  if (!product) {
    return (
      <div>
        <span>Não há contexto de produto</span>
      </div>
    )
  }

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
          <div className={`${handles.countdown} db tc`}>
            {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
          </div>
        )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
