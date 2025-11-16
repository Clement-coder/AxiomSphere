# AxiomSphere

AxiomSphere is a decentralized marketplace and execution engine for autonomous AI agents. These agents operate independently, performing tasks on behalf of users without requiring manual intervention. Examples include checking market prices, sending emails, managing online shops, gathering research data, or automating business workflows.

Each time an AI agent completes a task, the system processes a small USDC micropayment recorded onchain. Using USDC ensures predictable and stable pricing, while onchain settlement provides transparency, security, and auditability.

AxiomSphere is built with Account Abstraction (ERC-4337) to remove traditional blockchain friction. Users do not see wallet pop-ups, do not sign every transaction, and do not handle gas fees manually. The experience mirrors a standard web or mobile application, making onchain AI automation accessible to everyone.

---

## Vision

To build the most scalable and intelligent platform for autonomous AI agents, enabling a global network of self-operating digital workers that generate continuous, transparent revenue.

---

## Mission

* Make AI automation simple, accessible, and fully autonomous.
* Ensure all agent actions are verifiable and fairly priced.
* Provide a marketplace for developers to build and monetize AI agents.
* Drive high-volume onchain activity through task-based micropayments.
* Remove friction through Account Abstraction so users can deploy agents without blockchain expertise.

---

## Key Objectives

* **Frictionless Automation:** Deploy AI agents without dealing with wallets or gas fees.
* **Transparent Micropayments:** Every completed task is recorded onchain and fully auditable.
* **Developer Empowerment:** Build, publish, and earn from AI agents.
* **High Transaction Volume:** Millions of small, automated payments sustain continuous ecosystem activity.

---

## Core Features

### Autonomous Agent Deployment

Users can deploy AI agents for:

* Email and communication automation
* Market monitoring
* Research and data gathering
* E-commerce operations
* Business process automation

### Account Abstraction

AxiomSphere uses ERC-4337 smart accounts to simplify blockchain interactions:

* No wallet pop-ups
* No transaction signing
* Automatic gas fee management
* Stablecoin-based payments (USDC)
  This creates a smooth, intuitive user experience similar to a traditional app.

### Onchain Micropayment Engine

Each agent task triggers a small USDC payment that:

* Ensures fair compensation for agents and developers
* Generates continuous revenue for the platform
* Maintains an immutable execution and payment record

### AI Agent Marketplace

* Developers can publish and sell their AI agents
* Users can browse, purchase, and deploy agents
* AxiomSphere earns a commission from marketplace transactions

### User Dashboard

* Deploy and manage agents
* View task logs
* Track micropayments
* Adjust agent schedules and configurations
* Manage subscription tiers

### Walletless Authentication

* Login via email or social accounts
* Smart accounts generated automatically
* Agents operate using session keys without requiring user approval

---

## Technology Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion
* TypeScript

### Smart Contracts / Backend

* Solidity
* Foundry (Forge)
* Base Network
* Account Abstraction (ERC-4337)

---

## System Architecture

### AI Execution Layer

Handles agent task execution and integrates with APIs, websites, and external services.

### Account Abstraction Layer

Smart accounts manage:

* Gas sponsorship
* Automated USDC payments
* Secure agent permissions
* Session keys for hands-free automation

### Micropayment Layer

Processes and records small USDC payments for every task.

### Marketplace Layer

Enables publishing, purchasing, and monetizing autonomous agents.

### Frontend Layer

User interface for dashboards, analytics, agent management, and marketplace interactions.

---

## Development Roadmap

| Phase   | Description                             | Status      |
| ------- | --------------------------------------- | ----------- |
| Phase 1 | Dashboard and Account Abstraction login | In Progress |
| Phase 2 | Deployment of basic autonomous agents   | In Progress |
| Phase 3 | Onchain micropayment engine             | Planned     |
| Phase 4 | AI agent marketplace                    | Planned     |
| Phase 5 | Enterprise developer integrations       | Future      |

---

## Revenue Model

### Micropayment Fees

A small USDC fee is charged for every agent task.

### Subscription Plans

* **Basic:** 1–3 agents
* **Pro:** Unlimited agents, faster execution
* **Enterprise:** Custom automation pipelines

### Marketplace Commissions

AxiomSphere earns a percentage from each agent sale and usage-based revenue.

---

## User Experience Flow

1. **Sign Up (No Wallet Required):**
   Users log in via email or social account. A smart account is created automatically.

2. **Browse Marketplace:**
   Users discover or purchase AI agents.

3. **Deploy Agent:**
   Configure schedules, automation rules, and task options.

4. **Agent Runs Automatically:**
   Tasks execute independently using session keys.

5. **Micropayments Triggered:**
   Each action records a small, transparent USDC transaction onchain.

6. **Dashboard View:**
   Users monitor history, task logs, costs, and agent performance.

7. **Scale:**
   Deploy additional agents or upgrade subscription plans.

---

## Visual Identity

**Brand Name:** AxiomSphere

* *Axiom* represents a foundational truth or core principle.
* *Sphere* symbolizes a connected global ecosystem of agents.

**Colors:**

* Blue: Intelligence
* Purple: Automation
* White: Transparency

**Typography:**
Modern, clean sans-serif typefaces for clarity and professional presentation.

---

## Future Enhancements

* APIs for building custom agents
* Multi-agent orchestration
* Native mobile app
* Verified developer programs
* Multi-chain deployment
* AI-driven optimization tools

---

## Foundry Commands

### Build

```bash
forge build
```

### Test

```bash
forge test
```

### Deploy

```bash
forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY src/YourContract.sol:YourContract
```

### Format

```bash
forge fmt
```

### Gas Snapshot

```bash
forge snapshot
```

---

## License

AxiomSphere is released under the MIT License.
Users and developers are free to use, modify, and distribute the project with attribution.

---

## Contact

**Project Lead:** Clement Raymond
Email: [chinexzy37@gmail.com](mailto:chinexzy37@gmail.com)
Twitter: @phantomofcode

---

## Acknowledgements

* Base Network
* Hardhat and Foundry communities
* Early testers and contributors
* AI agent developers

---

