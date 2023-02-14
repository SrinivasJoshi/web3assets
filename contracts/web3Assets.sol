// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract web3Assets {
    address public immutable I_Owner;
    uint256 public totalAssets;

    uint256 public platformfeeBasisPoint;

    //to get the Interface of USD Tokens
    IERC20 public _USDCtoken;

    struct Asset {
        string name;
        uint256 price;
        string link;
        address payable creator;
    }
    mapping(uint256 => Asset) assetList;

    mapping(uint256 => mapping(address => bool)) private isUserOwned;

    modifier onlyWhenItemExist(uint tokenId) {
        require(tokenId <= totalAssets, "AssetShare: Token ID does not exist");
        _;
    }
    modifier onlyWhenUserAlreadyNotBought(uint tokenId) {
        require(
            doesUserOwnAsset(tokenId) == false,
            "AssetShare: User Already Bought"
        );
        _;
    }

    event AssetCreated(uint256 assetID, Asset asset);
    event AssetSold(uint256 assetID, Asset asset);
    event PriceUpdated(uint256 assetID, uint256 Price);

    constructor(address _USDCtokenAddr, uint256 _platformfeeBasisPoint) {
        _USDCtoken = IERC20(_USDCtokenAddr);
        I_Owner = msg.sender;
        platformfeeBasisPoint = _platformfeeBasisPoint;
    }

    function createAsset(
        string memory _assetName,
        string calldata _link,
        uint256 _price
    ) public {
        totalAssets++;
        uint tokenId = totalAssets;
        assetList[tokenId] = Asset(
            _assetName,
            _price,
            _link,
            payable(msg.sender)
        );
        emit AssetCreated(tokenId, assetList[tokenId]);
    }

    function buyAssetInToken(
        uint256 _tokenID
    )
        external
        onlyWhenItemExist(_tokenID)
        onlyWhenUserAlreadyNotBought(_tokenID)
    {
        uint tokenBalance = _USDCtoken.balanceOf(msg.sender);
        require(
            tokenBalance >= assetList[_tokenID].price,
            "AssetShare: Not enough money to buy asset"
        );
        uint _price = assetList[_tokenID].price;
        isUserOwned[_tokenID][msg.sender] = true;

        //payment for the Marketplace
        uint256 payoutForMarketplace = (_price * platformfeeBasisPoint) / 1000;
        //payment for payout
        uint256 payoutForCreator = _price - payoutForMarketplace;
        //Payout for marketplace
        bool amountSent = _USDCtoken.transferFrom(
            msg.sender,
            I_Owner,
            payoutForMarketplace
        );
        require(amountSent, "AssetShare: Transfer Failed !");
        //Payout for creator
        amountSent = _USDCtoken.transferFrom(
            msg.sender,
            assetList[_tokenID].creator,
            payoutForCreator
        );
        require(amountSent, "AssetShare: Transfer Failed !");

        emit AssetSold(_tokenID, assetList[_tokenID]);
    }

    function doesUserOwnAsset(
        uint256 tokenID
    ) public view onlyWhenItemExist(tokenID) returns (bool) {
        return isUserOwned[tokenID][msg.sender];
    }

    function getMarketItems() external view returns (Asset[] memory) {
        Asset[] memory marketItems = new Asset[](totalAssets);

        for (uint256 i = 1; i <= totalAssets; i++) {
            marketItems[i] = assetList[i];
        }
        return marketItems;
    }

    function getCreatedAssets() external view returns (Asset[] memory) {
        uint256 itemCount = 1;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < totalAssets; i++) {
            if (assetList[i].creator == msg.sender) {
                itemCount++;
            }
        }

        Asset[] memory createdAssets = new Asset[](itemCount);

        for (uint256 i = 1; i <= totalAssets; i++) {
            if (assetList[i].creator == msg.sender) {
                createdAssets[currentIndex] = assetList[i];
                currentIndex++;
            }
        }
        return createdAssets;
    }

    function getBoughtAssets() external view returns (Asset[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalAssets; i++) {
            if (isUserOwned[i][msg.sender]) {
                itemCount++;
            }
        }

        Asset[] memory boughtAssets = new Asset[](itemCount);

        for (uint256 i = 1; i <= totalAssets; i++) {
            if (isUserOwned[i][msg.sender]) {
                boughtAssets[currentIndex] = assetList[i];
                currentIndex += 1;
            }
        }
        return boughtAssets;
    }

    function updatePrice(uint tokenId, uint _price) external {
        require(
            msg.sender == assetList[tokenId].creator,
            "AssetShare: You are not the Owner"
        );
        assetList[tokenId].price = _price;
        emit PriceUpdated(tokenId, _price);
    }
}
