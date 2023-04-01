import { frontEndContractsFile, frontEndAbiFile } from '../helper-hardhat-config'
import fs from 'fs'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const updateUI: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { network, ethers } = hre
    const chainId = '31337'

    if (process.env.UPDATE_FRONT_END) {
        console.log('Writing to front end...')
        const raffle = await ethers.getContract('Raffle')
        const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, 'utf8'))
        if (chainId in contractAddresses) {
            if (!contractAddresses[network.config.chainId!].includes(raffle.address)) {
                contractAddresses[network.config.chainId!].push(raffle.address)
            }
        } else {
            contractAddresses[network.config.chainId!] = [raffle.address]
        }
        fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
        fs.writeFileSync(
            frontEndAbiFile,
            raffle.interface.format(ethers.utils.FormatTypes.json) as string
        )
        console.log('Front end written!')
    }
}
export default updateUI
updateUI.tags = ['all', 'frontend']
