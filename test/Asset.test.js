const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Asset", function () {
  let AssetFactory, Asset, TokenFactory, Token;
  let accounts;
  const AssetName = "MY AUTOBIOGRAPHY";
  const AssetLink = "www.xyz.com";
  beforeEach(async function () {
    accounts = await ethers.getSigners();
    TokenFactory = await ethers.getContractFactory("MyToken");
    Token = await TokenFactory.deploy();
    AssetFactory = await ethers.getContractFactory("web3Assets");
    Asset = await AssetFactory.deploy(Token.address, 300);
    await Asset.deployed();

    //minting a asset
    let val = ethers.utils.parseEther("1");
    const creator = accounts[1];
    await Asset.connect(creator).createAsset(AssetName, AssetLink, val);
  });
  it("Constructor", async () => {
    let owner = accounts[0];
    const ContractOwner = await Asset.I_Owner();
    expect(ContractOwner).to.be.equal(owner.address);
  });
  it("Checking create Asset ", async () => {
    const UserConnected = await Asset.connect(accounts[1]);
    const CreatedAssets = await UserConnected.getCreatedAssets();
    expect(CreatedAssets[0].name).to.be.equal(AssetName);
    expect(CreatedAssets[0].link).to.be.equal(AssetLink);
  });
  it("Buying Asset ", async () => {
    const buyer = accounts[2];
    let val = ethers.utils.parseEther("1");
    //Buy asset In the token
    await Token.connect(buyer).mint(100);
    await Token.connect(buyer).approve(Asset.address, val.mul(10));

    //token balance of Owner
    const IntialTokenBalance = await Token.balanceOf(accounts[0].address);

    await Asset.connect(buyer).buyAssetInToken(1);

    const OwnerAsset = await Asset.connect(buyer).doesUserOwnAsset(1);
    expect(OwnerAsset).to.be.true;
    //checking if array is returned or not
    const BoughtAssets = await Asset.connect(buyer).getBoughtAssets();
    expect(BoughtAssets[0].name).to.be.equal(AssetName);
    expect(BoughtAssets[0].link).to.be.equal(AssetLink);
    //Token are transferring or not
    const EndingTokenBalance = await Token.balanceOf(accounts[0].address);
    let amount = val.mul(300).div(1000);
    expect(EndingTokenBalance.sub(IntialTokenBalance)).to.be.equal(amount);
  });
});
