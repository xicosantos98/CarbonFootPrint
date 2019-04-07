pragma solidity >=0.4.2;

contract CarbonFootPrint{
    
    // -- Estrutura dos produtos
    struct Product{
        uint32 id;
        string name;
        string description;
        string prodUnit;
        uint32 co2eq;
        uint16 exp;
        bool intermediate;
        uint32 idOrganization;
        uint32 idUnit;
        uint32[] productFootPrints;
    }

    struct ProductFootprint{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 idProduct;
        uint32 idAno;
    }

    struct ProductQuantity{
        uint32 id;
        uint32 quantity;
        uint32 idPFootPrint;
        uint32 idM_Activity;
    }


    // -- Estrutura das organizações
    struct Organization{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32[] products;
        uint32[] m_activities;
        uint32[] m_fixcosts;
    }

    // -- Estrutura das atividades mensais
    struct MonthlyActivity{
        uint32 id;
        string description;
        uint32 co2eq;
        uint32 finalProductQt;
        uint16 exp;
        string month;
        uint32[] productQuantities; // -- codigo dos produtos de input
        uint32 output; // -- codigo do product foot print de output
        uint32 idOrganization;
        uint32 idUnit;
        uint32 idYear;
        address idUser;
    }

    // -- Estrutura dos custos fixos mensais
    struct MonthlyFixCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        string description;
        uint32 quantity;
        string month;
        uint32 idCostType;
        uint32 idOrganization;
        uint32 idYear;
    }

    // -- Estrutura dos custos dos produtos
    struct ProductCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 quantity;
        uint32 idCostType;
        uint32 idM_Activity;
    }

    // -- Estrutura do tipo de custo
    struct CostType{
        uint32 id;
        uint32 co2PerUnit;
        uint16 exp;
        string description;
        uint32 idUnit;
        uint32[] m_fixcosts;
        uint32[] products_costs;
    }

    // -- Estrutura das unidades
    struct Unit{
        uint32 id;
        string measure;
        string initials;
        uint32 base;
        uint32 exp;
        uint32 idUnit;
        bool negative;
    }

    // -- Users
    struct User{
        address user_add;
        uint16 tipo; // 0 - Admin , 1 - OrgAdmin,  2 - User
        bool status;
        uint32 idOrganization;
    }

    struct Year{
        uint32 id;
        string ano;
    }


    // -- Mappings
    mapping(uint32 => Product) public products;
    uint32 productsCount;

    mapping(uint32 => MonthlyActivity) public mactivities;
    uint32 mactivitiesCount;

    mapping(uint32 => Organization) public organizations;
    uint32 organizationsCount;

    mapping(uint32 => MonthlyFixCost) public mfixcosts;
    uint32 mfixcostsCount;

    mapping(uint32 => ProductCost) public productCosts;
    uint32 productCostsCount;

    mapping(uint32 => CostType) public costsTypes;
    uint32 costsTypesCount;

    mapping(uint32 => Unit) public units;
    uint32 public unitsCount;

    mapping(address => User) public users;
    address[] public arrayUsers;

    mapping(uint32 => ProductFootprint) public productFootPrints;
    uint32 pfootPrintCount;

    mapping(uint32 => ProductQuantity) public productsQuantities;
    uint32 productsQuantitiesCount;

    mapping(uint32 => Year) public yearly;
    uint32 yearliesCount;

    event registUserEvent (
        address indexed _candidateAddress
    );

    constructor () public{
        users[msg.sender] = User(msg.sender, 0, true, 0);
        arrayUsers.push(msg.sender);

        // -- Initalize units
        addUnit("tonne", "t", 10, 0, 1, false);
        addUnit("kilogram", "kg", 10, 3, 1, true);
        addUnit("gram", "g", 10, 6, 1, true);
        addUnit("milligram", "mg", 10, 9, 1, true);
    }

    function getUsersCount() public view returns(uint count) {
        return arrayUsers.length;
    }   



    function addUser (address _userResp,address _user, uint16 _tipo, uint32 _idOrganization) public {
        
        require(users[_userResp].user_add != address(0), "User is not registred");
        require(users[_user].user_add == address(0), "User already registred");

        if(_tipo == 0 || _tipo == 1){
            require(users[_userResp].tipo == 0, "You need to have admin permissions");
        }else if(_tipo == 2){
            require(users[_userResp].tipo == 1 , "You need to have organization admin permissions");
            require(users[_userResp].idOrganization == _idOrganization, "You need to belong to the organization");
        }

        users[_user] = User(_user, _tipo, true, _idOrganization);
        arrayUsers.push(_user);

        emit registUserEvent(_user);
        
    }

    function addUnit(string memory _measure, string memory _initials, uint32 _base, uint32 _exp, uint32 _idUnit,bool _negative) private{
        
        require(users[msg.sender].tipo == 0, "Necessita ter permissões 'Administrador'");

        unitsCount++;
        Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
        units[unitsCount] = Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
    }





}