=========
Liquidity
=========
Users can borrow as many tokens from an iToken as other users have lent to said contract

- ``marketLiquidity()``: amount of iToken available for borrowing (``totalAssetSupply()-totalAssetBorrow()``)
- ``totalAssetSupply()``: amount of iToken currently being supplied for lending, which includes earned interest (iToken total supply)
- ``totalAssetBorrow()``: amount of assets currently borrowed in active loans


How is interest rate determined
===============================

========
Lending
========

.. uml::

    @startuml
    Actor User
    Participant Token
    Participant iToken

    User -> Token: approve(iTokenAddress, depositAmount)
    User -> iToken: mint(depositAmount)
    iToken -> Token: transferFrom(userAddress, iTokenAddress, depositAmount)
    iToken -> iToken: _mint(userAddress, depositAmount)

    === the user decides to redeem the loan ==

    User -> iToken: burn(receiver, burnAmount)
    User <-- iToken: loanAmountPaid
    @enduml

It's possible for the iToken to not have enough Token balance to redeem the whole loan, that's why the loanAmountPaid is returned.

In that case, the User could call the ``claimLoanToken`` which puts them in a  "reserve" queue to be automatically paid back as liquidity becomes freed from borrowers [1]_ . The protocol doesn't guarantee all loans can be redeemed.

=========
Borrowing
=========

.. uml::
    :caption: short position

    @startuml
    Actor User
    Participant DepositToken
    Participant Token
    Participant iToken
    Participant pToken
    Participant StableToken
    Participant Kyber

    User -> DepositToken: approve(pTokenAddress, depositAmount)
    User -> pToken: mintWithToken(depositAmount, DepositToken)
    pToken -> Kyber: swap(DepositToken, Token, depositAmount)
    iToken -> Token: transferFrom(userAddress, iTokenAddress, depositAmount)
    iToken -> iToken: _mint(userAddress, depositAmount)

    === the user decides to redeem the loan ==

    User -> iToken: burn(receiver, burnAmount)
    User <-- iToken: loanAmountPaid
    @enduml

.. [1]: https://docs.bzx.network/fulcrum-integration/lending#claimloantoken

