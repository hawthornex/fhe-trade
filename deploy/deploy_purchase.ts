import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const deployed = await deploy("FHEPurchaseManager", {
    from: deployer,
    log: true,
  });

  log(`FHEPurchaseManager contract: ${deployed.address}`);
};
export default func;
func.id = "deploy_fhe_purchase_manager"; // id required to prevent reexecution
func.tags = ["FHEPurchaseManager"];

