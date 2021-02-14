import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
export declare const onCloseIssue: (owner: string, repo: string, context: Context, octokit: InstanceType<typeof GitHub>) => Promise<void>;
