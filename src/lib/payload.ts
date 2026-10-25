import { getPayload } from 'payload'

import config from '@payload-config'

/** Cliente de Payload (API local, sin HTTP). */
export const getPayloadClient = () => getPayload({ config })
