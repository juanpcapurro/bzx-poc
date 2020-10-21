================
Static contracts
================

TokenRegistry
=============
Address in v2: https://etherscan.io/address/0xf0E474592B455579Fe580D610b846BdBb529C6F7#code

It's just a helper contract which gets the token list from the `bZxProtocol`_ contract and provides the token list in a more client-friendly way since it uses the ABIEncoderV2.


bZxProtocol
===========
Address in v2: https://etherscan.io/address/0xd8ee69652e4e4838f2531732a46d1f7f584f0b7f#code

It's a Proxy contract which supports having multiple implementation contracts, storing a mapping from call signature to implementation target.

Example implementation: LoanOpenings https://etherscan.io/address/0x471b40d3f490150e2dc581e01d14440dd3c1ce03#code

.. warning:: This means there can be more than one 'implementation' contract active at a time.

There are two ways to add an implementation contract (only by the contract's owner):
- ``setTarget``: add a (function signature, implementation contract) pair normally. Is an external function and can be handled but it's seldom used
- ``replaceContract``: does a delegatecall to the contract so it can register its own methods. doesn't emit events and only the contract address is a parameter of the call. It's the most frequently used.

========================
Implementation contracts
========================

LoanMaintenance
===============

ProtocolSettings
================

LoanClosings
============

LoanClosingsWithGasToken
========================

SwapsExternal
=============

LoanSettings
============

