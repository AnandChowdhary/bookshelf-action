import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
export declare const onNewIssue: (owner: string, repo: string, context: Context, octokit: InstanceType<typeof GitHub>) => Promise<void>;
