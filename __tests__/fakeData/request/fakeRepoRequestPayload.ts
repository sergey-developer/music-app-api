import { datatype } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { MaybeNull } from 'app/interface/utils'
import { EntityNamesEnum } from 'database/constants'
import { ICreateOneRequestPayload } from 'modules/request/repository'

const fakeRepoRequestPayload = (
  payload?: MaybeNull<Pick<ICreateOneRequestPayload, 'entityName'>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneRequestPayload> => {
  const { isIncorrect } = config

  return {
    creator: isIncorrect ? datatype.string() : fakeEntityId(),
    entity: isIncorrect ? datatype.string() : fakeEntityId(),
    entityName: payload?.entityName || EntityNamesEnum.Artist,
  }
}

export default fakeRepoRequestPayload
