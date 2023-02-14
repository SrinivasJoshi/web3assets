// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract web3Assets{
    IERC20 private _USDCtoken;
    address payable private owner;
    struct Asset{
        uint256 assetId;
        uint256 price;
        string link;
        address payable creator;
    }
    uint256 public totalAssets;
    mapping(uint256 => Asset) assetList;
    mapping(uint256 => mapping(address => bool)) private isUserOwned;

    event buyAssetEvent(uint256 _assetId,Asset _asset);
    event createAssetEvent(uint256 _assetId,Asset _asset);

    constructor(address _USDCtokenAddr){
        owner = payable(msg.sender);
        _USDCtoken = IERC20(_USDCtokenAddr);
    }

    function doesUserOwnAsset(uint256 _assetId) public view returns(bool){
        return isUserOwned[_assetId][msg.sender];
    }

    function buyAsset(uint256 _assetId) public payable{
        require(_assetId < totalAssets,"Asset ID does not exist");
        //add USDC code below
        require(msg.value >= assetList[_assetId].price,"Not enough money to buy asset");
        isUserOwned[_assetId][msg.sender] = true;
        emit buyAssetEvent(_assetId,assetList[_assetId]);

        //add USDC code below
        assetList[_assetId].creator.transfer(msg.value * 90/100);
    }

    function createAsset(string calldata _link,uint256 _price) public{
        Asset memory _asset = Asset({
            assetId : totalAssets,
            price : _price,
            link:_link,
            creator : payable(msg.sender)
        });
        assetList[totalAssets] = _asset;
        emit createAssetEvent(totalAssets,_asset);
        totalAssets+=1;
    }

    function getMarketItems() public view returns(Asset[] memory){
        Asset[] memory marketItems = new Asset[](totalAssets);

        for(uint256 i;i < totalAssets;i++){
            Asset storage currentItem = assetList[i];
            marketItems[i] = currentItem;
        }
        return marketItems;
    }

    function getCreatedAssets() public view returns(Asset[] memory){
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i;i<totalAssets;i++){
            if(assetList[i].creator == msg.sender){
                itemCount++;
            }
        }

        Asset[] memory createdAssets = new Asset[](itemCount);

        for(uint256 i;i<totalAssets;i++){
            if(assetList[i].creator == msg.sender){
                Asset storage currentItem = assetList[i];
                createdAssets[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return createdAssets;
    }

    function getBoughtAssets() public view returns(Asset[] memory){
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i;i<totalAssets;i++){
            if(isUserOwned[i][msg.sender]){
                itemCount++;
            }
        }

        Asset[] memory boughtAssets = new Asset[](itemCount);

        for(uint256 i;i<totalAssets;i++){
            if(isUserOwned[i][msg.sender]){
                Asset storage currentItem = assetList[i];
                boughtAssets[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return boughtAssets;
    }

    function withdraw() external{
        require(msg.sender == owner,"Not the owner");
        (owner).transfer(address(this).balance);
    }
}