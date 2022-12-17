import { DocumentSymbol } from "vscode";
import { vscode } from "./utilities/vscode";
import { useStore } from "./context/store";
import { ButtonNodeCompiler } from "./compilers/cypress/buttonNodeCompiler"
import YAML from 'yaml'
import { VisitPageNodeCompiler } from "./compilers/cypress/VisitPageNode";
import { TextInputNodeCompiler } from "./compilers/cypress/TextInputNode";
import { CheckboxNodeCompiler } from "./compilers/cypress/CheckboxNode";
export class Compiler {

	constructor() {

	}

	static compile(store): string {
		// let buttonNodeCompiler = new ButtonNodeCompiler()
		console.log("COMPILER>COMPILE")
		console.log("STORE", store)

		let fakeStoreText = `---\nnodes:\n  '2':\n    id: '2'\n    type: textInputType\n    data:\n      sourceHandleId: c\n      targetHandleId: d\n      label: ''\n    position:\n      x: 380\n      y: 50\n    inPorts:\n      field: "#user_email"\n      value: hungdh131@gmail.com\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '3':\n    id: '3'\n    type: textInputType\n    data:\n      sourceHandleId: e\n      targetHandleId: f\n      label: ''\n    position:\n      x: 680\n      y: 50\n    inPorts:\n      field: "#user_password"\n      value: thisisthepassword\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '4':\n    id: '4'\n    type: textInputType\n    data:\n      sourceHandleId: g\n      targetHandleId: h\n      label: ''\n    position:\n      x: 980\n      y: 50\n    inPorts:\n      field: "#user_password_confirmation"\n      value: thisisthepassword\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '5':\n    id: '5'\n    type: checkboxNode\n    data:\n      sourceHandleId: i\n      targetHandleId: k\n      label: ''\n    position:\n      x: 1280\n      y: 50\n    inPorts:\n      field: "#tos"\n      isChecked: 'on'\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '6':\n    id: '6'\n    type: buttonNode\n    data:\n      sourceHandleId: l\n      targetHandleId: m\n      label: ''\n    position:\n      x: 1595\n      y: 50\n    inPorts:\n      field: ".btn .btn-primary .w-full"\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '9':\n    id: '9'\n    type: visitNode\n    data:\n      sourceHandleId: a\n      targetHandleId: b\n      label: ''\n    position:\n      x: 10\n      y: 150\n    inPorts:\n      url: https://auth.planetscale.com/sign-up\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\n  '10':\n    id: '10'\n    type: containsNode\n    data:\n      sourceHandleId: n\n      targetHandleId: o\n      label: ''\n    position:\n      x: 1800\n      y: 50\n    inPorts:\n      field: "#title"\n      value: "Title"\n    outPorts: {}\n    description: description\n    componentName: compName\n    outputQ:\n    - outputQ\nedges:\n  '2':\n    source: '2'\n    sourceHandle: d\n    target: '3'\n    targetHandle: e\n  '3':\n    source: '3'\n    sourceHandle: f\n    target: '4'\n    targetHandle: g\n  '4':\n    source: '4'\n    sourceHandle: h\n    target: '5'\n    targetHandle: i\n  '5':\n    source: '5'\n    sourceHandle: k\n    target: '6'\n    targetHandle: l\n  '6':\n    source: '6'\n    sourceHandle: m\n    target: '10'\n    targetHandle:\n  '9':\n    source: '9'\n    sourceHandle: b\n    target: '2'\n    targetHandle: c\n  '10':\n    source: '10'\n    sourceHandle: n\n    target: '11'\n    targetHandle: o\n`
		let fakeStore = YAML.parse(fakeStoreText)

		store = fakeStore
		let compiledText = ""
		let orderNodes = this.buildNodeChain(store)
		console.log("orderNodes: ")
		console.log(orderNodes)

		orderNodes.forEach(node => {
			let compiler = this.findCompiler(node)
			compiledText += compiler.compile(node) + "\n"
		})

		return this.buildCypressJsFile(compiledText)
	}

	static buildCypressJsFile(compiledText: string) {
		return `
		/// <reference types="cypress" />

		context('Generated By Ctflow', () => {
			it('Demo CtFlow', () => {
				${compiledText}
			})
		})
		`
	}

	static findCompiler(node: any) {
		switch (node.type) {
			case "ButtonNode": {
				return ButtonNodeCompiler
			}
			case "visitNode": {
				return VisitPageNodeCompiler
			}
			case "textInputType": {
				return TextInputNodeCompiler
			}
			case "checkboxNode": {
				return CheckboxNodeCompiler
			}
			default: {
				return ButtonNodeCompiler
			}
		}
	}

	static findRootNode(store: any) {
		for (var nodeId in store.nodes) {
			if (store.nodes[nodeId].type === 'visitNode') {
				return store.nodes[nodeId]
			}
		}
	}

	static findEdgeWithSourceId(sourceId: any, edges: any) {
		for (var edgeId in edges) {
			if (edges[edgeId].source === sourceId) {
				return edges[edgeId]
			}
		}

		return false
	}

	// return array of nodes by order
	static buildNodeChain(store: any): any[] {
		let currentNode = this.findRootNode(store)
		let currentEdge: any;
		let orderedNodes = [currentNode]

		// prevent infinity loop
		for (let counter = 0; counter < Object.keys(store.edges).length; counter++) {
			currentEdge = this.findEdgeWithSourceId(currentNode.id, store.edges)
			console.log("currentEdge", currentEdge)
			currentNode = store.nodes[currentEdge.target.toString()]
			if (!currentNode) { break }
			orderedNodes.push(currentNode)
		}

		return orderedNodes;
	}
}
