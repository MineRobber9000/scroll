import { Client } from "switchchat";

const sc = new Client(process.env.CHATBOX_TOKEN);

sc.defaultName = "\\roll";
sc.defaultFormattingMode = "markdown";

sc.on("command",async (cmd) => {
	if (cmd.command=="roll") {
		if (cmd.args.length!=1) {
			await sc.tell(cmd.user.name,"Usage: \\roll <spec>\nNdS+M or NdS-M or NdSdl (drop lowest) or NdSdh (drop highest)");
			return;
		}
		let spec = cmd.args[0];
		let groups = spec.match(/(\d+)d(\d+)([+-]\d+|dl|dh)?/i);
		//console.log(groups);
		let num = parseInt(groups[1]);
		let sides = parseInt(groups[2]);
		let mod = groups[3];
		let results = [];
		for (let i=0;i<num;i++) {
			results.push(Math.floor(Math.random()*sides+1));
		}
		//console.log(results);
		results.sort((a,b)=>a-b);
		let sum = results.reduce((acc,v)=>acc+v,0);
		let modstr="";
		if (mod) {
			if (mod.toLowerCase()==="dl") {
				modstr=", drop lowest";
				sum-=results[0];
			} else if (mod.toLowerCase()==="dh") {
				modstr=", drop highest";
				sum-=results.slice(-1)[0];
			} else {
				let modint = parseInt(mod);
				modstr=modint.toString();
				if (modint>=0) modstr="+"+modstr;
				sum+=modint;
			}
		}
		await sc.tell(cmd.user.name,results.join("+")+modstr+"="+sum);
	}
});

sc.connect();
