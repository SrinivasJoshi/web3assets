// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract web3Assets {
    address payable public immutable I_Owner;
    uint256 public totalAssets;

    uint256 public platformfeeBasisPoint;

    //to get the Interface of USD Tokens
    IERC20 public _USDCtoken;

    struct Asset {
        uint assetId;
        string assetName;
        uint256 price;
        string link;
        address payable creator;
    }
    mapping(uint256 => Asset) assetList;

    mapping(uint256 => mapping(address => bool)) private isUserOwned;

    modifier onlyWhenItemExist(uint tokenId) {
        require(tokenId <= totalAssets, "web3Assets: Token ID does not exist");
        _;
    }
    modifier onlyWhenUserAlreadyNotBought(uint tokenId,address _userAddr) {
        require(
            doesUserOwnAsset(tokenId,_userAddr) == false,
            "web3Assets: User Already Bought"
        );
        _;
    }

    event AssetCreated(uint256 assetID, Asset asset);
    event AssetSold(uint256 assetID, Asset asset);
    event PriceUpdated(uint256 assetID, uint256 Price);

    constructor(address _USDCtokenAddr, uint256 _platformfeeBasisPoint) {
        _USDCtoken = IERC20(_USDCtokenAddr);
        I_Owner = payable(msg.sender);
        platformfeeBasisPoint = _platformfeeBasisPoint;
    }

    /**
     *
     * @notice to create assets for sale
     * @param _link the IPFS link
     * @param _price is the price of the asset
     */

    function createAsset(string calldata _link, uint256 _price,string memory _name) public {
        uint _assetID = totalAssets;
        assetList[_assetID] = Asset(_assetID,_name, _price, _link, payable(msg.sender));
        isUserOwned[_assetID][msg.sender] = true;
        totalAssets++;
        //add event price and name 
        emit AssetCreated(_assetID, assetList[_assetID]);
    }

    /// @notice buy available assets and to use it
    function buyAssetInToken(
        uint256 _assetID
    )
        external
        onlyWhenItemExist(_assetID)
        onlyWhenUserAlreadyNotBought(_assetID,msg.sender)
    {
        uint tokenBalance = _USDCtoken.balanceOf(msg.sender);
        uint _price = assetList[_assetID].price;
        require(
            tokenBalance >= _price,
            "web3Assets: Not enough money to buy asset"
        );
        
        isUserOwned[_assetID][msg.sender] = true;

        //payment for the Marketplace
        uint256 payoutForMarketplace = (_price * platformfeeBasisPoint) / 100;
        //payment for payout
        uint256 payoutForCreator = _price - payoutForMarketplace;
        //Payout for marketplace
        bool amountSent = _USDCtoken.transferFrom(
            msg.sender,
            I_Owner,
            payoutForMarketplace
        );
        require(amountSent, "web3Assets: Transfer Failed !");
        //Payout for creator
        amountSent = _USDCtoken.transferFrom(
            msg.sender,
            assetList[_assetID].creator,
            payoutForCreator
        );
        require(amountSent, "web3Assets: Transfer Failed !");

        emit AssetSold(_assetID, assetList[_assetID]);
    }

    /// @dev to check if the owner have the access or not
    function doesUserOwnAsset(uint256 _tokenID,address _userAddr) public view onlyWhenItemExist(_tokenID) returns (bool) {
        return isUserOwned[_tokenID][_userAddr];
    }

    function checkAssetOwnedByUser(uint256 _tokenID) public view returns(uint8) {
        if(isUserOwned[_tokenID][msg.sender])
        {
            return 1;
        }
        return 0;
    }


    /// @dev total assets ever listed in the markeplace
    function getMarketItems() external view returns (Asset[] memory) {
        Asset[] memory marketItems = new Asset[](totalAssets);

        for (uint256 i; i < totalAssets; i++) {
            marketItems[i] = assetList[i];
        }
        return marketItems;
    }

    /// @notice to fetch number of assets bought by a User
    function getCreatedAssets(address user) external view returns (Asset[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i; i < totalAssets; i++) {
            if (assetList[i].creator == user) {
                itemCount++;
            }
        }

        Asset[] memory createdAssets = new Asset[](itemCount);

        for (uint256 i; i < totalAssets; i++) {
            if (assetList[i].creator == user) {
                createdAssets[currentIndex] = assetList[i];
                currentIndex++;
            }
        }
        return createdAssets;
    }

    function getBoughtAssets(address user) external view returns (Asset[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        // should not be the creator
        for (uint256 i; i < totalAssets; i++) {
            if (isUserOwned[i][user] && assetList[i].creator != user) {
                itemCount++;
            }
        }

        Asset[] memory boughtAssets = new Asset[](itemCount);

        for (uint256 i; i<totalAssets; i++) {
            if (isUserOwned[i][user] && assetList[i].creator != user) {
                boughtAssets[currentIndex] = assetList[i];
                currentIndex += 1;
            }
        }
        return boughtAssets;
    }

    function updatePrice(uint tokenId, uint _price) external {
        require(
            msg.sender == assetList[tokenId].creator,
            "web3Assets: You are not the Owner"
        );
        assetList[tokenId].price = _price;
        emit PriceUpdated(tokenId, _price);
    }

    function updateTokenAddr(address _tokenAddr) external {
        require(msg.sender == I_Owner, "web3Assets: You are not the Owner");
        _USDCtoken = IERC20(_tokenAddr);
    }
}
